# Relationships

```
instructors ─1───*─ coverage_areas
     │      ─1───*─ rate_cards ─1───*─ bookings
     │      ─1───1─ bank_accounts
     │      ─1───1─ notification_preferences
     │      ─1───*─ device_tokens · auth_sessions · verification_codes · notifications
     │      ─1───*─ subscriptions ─*───1─ subscription_plans
     │      ─1───*─ learners ─1───*─ bookings ─*───0..1─ lesson_packages
     │                    │            └─1───*─ booking_events
     │                    └─1───*─ messages (booking?, package?)
     │
     │  Referral programme
     ├─1───1─ referral_codes ─1───*─ referrals
     ├─1───*─ referrals            (as referrer)
     ├─1───0..1─ referrals         (as referred — unique)
     ├─1───1─ credit_accounts ─1───*─ credit_transactions
     └─ referrals ─1───0..1─ credit_transactions (type = referral_reward)
                  ─1───*─ credit_transactions (type = reversal)
                  ─1───*─ referral_fraud_signals
                  ─*───0..1─ subscriptions (referred instructor's)
```

| Relationship | Cardinality | On delete | Why |
| --- | --- | --- | --- |
| instructors → learners, bookings | 1 : many | CASCADE from instructor. Learner → booking is RESTRICT | Lesson history outlives learner archiving |
| bookings → lesson_packages | many : 0..1 | SET NULL | |
| instructors → subscriptions | 1 : many (one live) | CASCADE | Partial unique index on live statuses |
| instructors → referral_codes | 1 : 1 | CASCADE | One code per instructor |
| referral_codes → referrals | 1 : many | RESTRICT | A code is reused by many new instructors |
| instructors (referred) → referrals | 1 : 0..1 | RESTRICT | **A new instructor has at most one referrer** |
| instructors (referrer) → referrals | 1 : many | RESTRICT | Audit trail must survive |
| instructors → credit_accounts | 1 : 1 | CASCADE | |
| credit_accounts → credit_transactions | 1 : many | RESTRICT | Append-only ledger |
| referrals → credit_transactions | 1 : ≤1 reward, many reversals | RESTRICT | Unique index on reward per referral |

Tenancy: everything except `subscription_plans` belongs to exactly one instructor. In `referrals` the row is visible to the **referrer** (read-only, limited columns) and is never shown to the referred instructor apart from their own benefit.
