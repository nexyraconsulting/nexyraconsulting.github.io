-- NEXTime Rota & Timesheet — MySQL 8.0+ / MariaDB 10.6+ schema
-- Use this when the host only offers MySQL (for example cPanel). Same tables as schema-postgresql.sql.
-- The reference server in ../server is written for PostgreSQL; with MySQL, implement the same
-- endpoints (docs/api-contract.md) in your stack (PHP, Node with mysql2, .NET …).
-- Run:  mysql -u USER -p DATABASE < schema-mysql.sql

SET NAMES utf8mb4;

-- ===================== PART A — Step 1 =====================

CREATE TABLE IF NOT EXISTS organisations (
  id          VARCHAR(64)  NOT NULL PRIMARY KEY,
  name        VARCHAR(200) NOT NULL,
  created_at  DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS users (
  id              CHAR(36)     NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64)  NOT NULL,
  email           VARCHAR(254) NOT NULL,
  name            VARCHAR(200) NOT NULL,
  role            ENUM('Administrator','Manager','Employee') NOT NULL,
  password_hash   VARCHAR(255) NULL,          -- use password_hash() in PHP (bcrypt/argon2)
  employee_ref    VARCHAR(32)  NULL,
  created_at      DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  last_login_at   DATETIME(3)  NULL,
  disabled_at     DATETIME(3)  NULL,
  UNIQUE KEY users_email_uq (email),
  CONSTRAINT users_org_fk FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS organisation_snapshots (
  organisation_id VARCHAR(64) NOT NULL PRIMARY KEY,
  version         INT         NOT NULL,
  data            JSON        NOT NULL,       -- up to ~5 MB typical; raise max_allowed_packet to 64M
  updated_at      DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  updated_by      CHAR(36)    NULL,
  CONSTRAINT snap_org_fk FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS audit_log (
  organisation_id VARCHAR(64)  NOT NULL,
  id              VARCHAR(64)  NOT NULL,
  at              DATETIME(3)  NOT NULL,
  action          VARCHAR(200) NOT NULL,
  entity          VARCHAR(32)  NULL,
  ref             VARCHAR(64)  NULL,
  employee_ref    VARCHAR(32)  NULL,
  work_date       DATE         NULL,
  summary         TEXT         NULL,
  changes         JSON         NULL,
  reason          TEXT         NULL,
  actor_user_id   CHAR(36)     NULL,
  received_at     DATETIME(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (organisation_id, id),
  KEY audit_at_idx (organisation_id, at),
  CONSTRAINT audit_org_fk FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
-- Append-only: grant the app user INSERT and SELECT on audit_log, not UPDATE or DELETE.

-- ===================== PART B — Step 2 (normalised) =====================

CREATE TABLE IF NOT EXISTS locations (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  name VARCHAR(120) NOT NULL,
  UNIQUE KEY (organisation_id, name),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS departments (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  name VARCHAR(120) NOT NULL,
  UNIQUE KEY (organisation_id, name),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS job_roles (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  name VARCHAR(120) NOT NULL,
  UNIQUE KEY (organisation_id, name),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS user_locations (
  user_id CHAR(36) NOT NULL,
  location_id CHAR(36) NOT NULL,
  PRIMARY KEY (user_id, location_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS organisation_settings (
  organisation_id VARCHAR(64) NOT NULL PRIMARY KEY,
  standard_weekly DECIMAL(5,2) NOT NULL DEFAULT 40,
  long_shift DECIMAL(4,2) NOT NULL DEFAULT 10,
  late_mins INT NOT NULL DEFAULT 5,
  min_rest DECIMAL(4,2) NOT NULL DEFAULT 11,
  max_days INT NOT NULL DEFAULT 6,
  max_weekly JSON NOT NULL,
  week_starts_on TINYINT NOT NULL DEFAULT 1,
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shift_templates (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  ref VARCHAR(16) NOT NULL,
  name VARCHAR(80) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_mins INT NOT NULL DEFAULT 0,
  UNIQUE KEY (organisation_id, ref),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS employees (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  ref VARCHAR(32) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  job_role VARCHAR(120) NULL,
  department_id CHAR(36) NULL,
  location_id CHAR(36) NULL,
  contract ENUM('Full Time','Part Time','Zero Hour Contract') NOT NULL,
  status ENUM('Active','On Leave','Left') NOT NULL DEFAULT 'Active',
  start_date DATE NULL,
  unavailable_days JSON NULL,                    -- [0,6]
  notes TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  row_version INT NOT NULL DEFAULT 1,
  UNIQUE KEY (organisation_id, ref),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shifts (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  ref VARCHAR(32) NOT NULL,
  employee_id CHAR(36) NOT NULL,
  location_id CHAR(36) NULL,
  work_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  break_mins INT NOT NULL DEFAULT 0,
  actual_start TIME NULL,
  actual_end TIME NULL,
  actual_break_mins INT NULL,
  notes TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  updated_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  row_version INT NOT NULL DEFAULT 1,
  UNIQUE KEY (organisation_id, ref),
  KEY shifts_date_idx (organisation_id, work_date),
  KEY shifts_emp_idx (employee_id, work_date),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS leave_requests (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  ref VARCHAR(32) NOT NULL,
  employee_id CHAR(36) NOT NULL,
  leave_type ENUM('Holiday','Sickness','Unavailable','Other') NOT NULL,
  from_date DATE NOT NULL,
  to_date DATE NOT NULL,
  notes TEXT NULL,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE KEY (organisation_id, ref),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS shift_swaps (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  ref VARCHAR(32) NOT NULL,
  shift_id CHAR(36) NOT NULL,
  from_employee_id CHAR(36) NOT NULL,
  to_employee_id CHAR(36) NULL,
  reason TEXT NULL,
  status ENUM('Pending','Approved','Declined','Cancelled') NOT NULL DEFAULT 'Pending',
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  decided_at DATETIME(3) NULL,
  decided_by CHAR(36) NULL,
  UNIQUE KEY (organisation_id, ref),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
  FOREIGN KEY (shift_id) REFERENCES shifts(id) ON DELETE CASCADE,
  FOREIGN KEY (from_employee_id) REFERENCES employees(id),
  FOREIGN KEY (to_employee_id) REFERENCES employees(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS timesheet_approvals (
  organisation_id VARCHAR(64) NOT NULL,
  employee_id CHAR(36) NOT NULL,
  week_start DATE NOT NULL,
  approved_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  approved_by CHAR(36) NULL,
  hours DECIMAL(6,2) NOT NULL,
  PRIMARY KEY (employee_id, week_start),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
  FOREIGN KEY (employee_id) REFERENCES employees(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rota_publications (
  id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
  organisation_id VARCHAR(64) NOT NULL,
  location_id CHAR(36) NULL,
  week_start DATE NOT NULL,
  published_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  published_by CHAR(36) NULL,
  shift_count INT NOT NULL DEFAULT 0,
  KEY (organisation_id, week_start),
  FOREIGN KEY (organisation_id) REFERENCES organisations(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB;
