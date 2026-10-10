import svgPaths from "./svg-tr4db1clfp";

function Link() {
  return (
    <div className="[word-break:break-word] h-[20px] leading-[20px] relative shrink-0 text-[14px] tracking-[2.52px] uppercase w-[182.288px] whitespace-nowrap" data-name="Link">
      <p className="absolute font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold left-0 text-[#14181d] top-0">Nexyra</p>
      <p className="absolute font-['Hanken_Grotesk:Light',sans-serif] font-light left-[74.46px] text-[#6d6966] top-0">Consulting</p>
    </div>
  );
}

function Link1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Services
      </p>
    </div>
  );
}

function Link2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Work
      </p>
    </div>
  );
}

function Link3() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#9333ea] text-[11px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Pricing
      </p>
    </div>
  );
}

function Link4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Contact
      </p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex gap-[32px] items-center relative shrink-0" data-name="Container">
      <Link1 />
      <Link2 />
      <Link3 />
      <Link4 />
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g id="Icon">
          <path d="M2.29167 5.5H8.70833" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
          <path d={svgPaths.p3ed2e300} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Link5() {
  return (
    <div className="bg-[#9333ea] content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[11px] text-white tracking-[1.54px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Get in touch
      </p>
      <Icon />
    </div>
  );
}

function Navigation() {
  return (
    <div className="content-stretch flex h-[56px] items-center justify-between max-w-[1280px] px-[24px] relative shrink-0 w-full" data-name="Navigation">
      <Link />
      <Container />
      <Link5 />
    </div>
  );
}

function Header() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(248,247,244,0.95)] border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Header">
      <Navigation />
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#9333ea] text-[11px] tracking-[2.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Pricing
      </p>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex flex-col h-[176px] items-start pt-[28px] relative shrink-0 w-[626.2px]" data-name="Heading 1">
      <div className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#14181d] text-[70.032px] tracking-[-1.7508px] whitespace-nowrap">
        <p className="leading-[73.534px] mb-0">Two pricing</p>
        <p className="leading-[73.534px]">engines.</p>
      </div>
    </div>
  );
}

function ParagraphMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[24px] relative shrink-0" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[29.25px] relative shrink-0 text-[#6d6966] text-[18px] w-[480px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Nine capabilities, one firm, two ways to engage. Brand, motion, and data visualisation run through a fixed-price studio catalogue. Product and engineering work runs through a structured partnership ladder.
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="col-[1/span_7] content-stretch flex flex-col h-[332.575px] items-start justify-self-stretch relative row-1 self-start shrink-0" data-name="Container">
      <Paragraph />
      <Heading />
      <ParagraphMargin />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[1.98px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Engine 1
      </p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[4px] relative shrink-0 w-[387.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#14181d] text-[16px] whitespace-nowrap">Studio Catalogue</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[387.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[388px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Fixed price per deliverable, or a monthly credit pool. Repeatable, capacity-constrained, sold standalone or attached to a delivery engagement.
      </p>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col items-start p-[20px] relative shrink-0 w-full" data-name="Container">
      <Paragraph1 />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#9333ea] text-[11px] tracking-[1.98px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Engine 2
      </p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="content-stretch flex flex-col h-[28px] items-start pt-[4px] relative shrink-0 w-[387.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[24px] relative shrink-0 text-[#14181d] text-[16px] whitespace-nowrap">Partnership Ladder</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[387.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[388px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Discover → Build → Run. One engagement model for all six product and engineering services, regardless of platform or stack.
      </p>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-[rgba(243,238,255,0.4)] border-[0.8px] border-[rgba(147,51,234,0.25)] border-solid content-stretch flex flex-col items-start p-[20px] relative shrink-0 w-full" data-name="Container">
      <Paragraph4 />
      <Paragraph5 />
      <Paragraph6 />
    </div>
  );
}

function Container3() {
  return (
    <div className="col-[8/span_5] content-stretch flex flex-col gap-[12px] items-start justify-self-stretch pt-[56px] relative row-1 self-start shrink-0" data-name="Container">
      <Container4 />
      <Container5 />
    </div>
  );
}

function Container1() {
  return (
    <div className="gap-x-[64px] gap-y-[64px] grid grid-cols-[____________34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px] grid-rows-[_392.70px] relative shrink-0 w-full" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Section() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex flex-col items-start max-w-[1280px] pb-[56px] pt-[64px] px-[24px] relative shrink-0 w-full" data-name="Section">
      <Container1 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[2.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Architecture
      </p>
    </div>
  );
}

function Container7() {
  return <div className="bg-[rgba(20,24,29,0.1)] flex-[997.288_0_0] h-px min-w-px relative" data-name="Container" />;
}

function Container6() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[1119.2px]" data-name="Container">
      <Paragraph7 />
      <Container7 />
    </div>
  );
}

function Image() {
  return (
    <div className="h-[460.8px] overflow-clip relative shrink-0 w-full" data-name="Image">
      <div className="absolute inset-[7.62%_67.14%_86.19%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[8.69%_66.24%_87.62%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">{`Brand Management & Governance`}</p>
      <div className="absolute inset-[16.19%_67.14%_77.62%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[17.26%_78.35%_79.05%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">Creative Production</p>
      <div className="absolute inset-[24.76%_67.14%_69.05%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[25.83%_68.32%_70.48%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">{`Infographic & Data Visualization`}</p>
      <div className="absolute inset-[10.71%_64%_72.14%_34.29%]" data-name="Vector">
        <div className="absolute inset-[-0.9%_-5.42%_-0.9%_0]">
          <svg className="block size-full" fill="none" height="80.4206" preserveAspectRatio="none" viewBox="0 0 13.8789 80.4206" width="13.8789">
            <path d={svgPaths.p24c4c900} id="Vector" stroke="#9B9891" strokeWidth="1.42629" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[19.29%_54%_80.71%_36%]" data-name="Vector">
        <div className="absolute inset-[-0.71px_0]">
          <svg className="block size-full" fill="none" height="1.42629" preserveAspectRatio="none" viewBox="0 0 76.8 1.42629" width="76.8">
            <path d="M0 0.713143H76.8" id="Vector" stroke="#9B9891" strokeWidth="1.42629" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.1%_2.86%_69.52%_47.14%]" data-name="Vector">
        <div className="absolute inset-[-0.8%_-0.21%]">
          <svg className="block size-full" fill="none" height="104.777" preserveAspectRatio="none" viewBox="0 0 385.646 104.777" width="385.646">
            <path d={svgPaths.pe298800} id="Vector" stroke="#9333EA" strokeWidth="1.64571" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute bottom-[85.42%] font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-1/2 not-italic right-[32.16%] text-[#14181d] text-[16.457px] top-[10.24%] whitespace-nowrap">Studio catalogue</p>
      <p className="[word-break:break-word] absolute bottom-[80.34%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic right-[7.81%] text-[#5b5952] text-[13.166px] top-[16.19%] whitespace-nowrap">Fixed price per deliverable, or a monthly credit pool.</p>
      <p className="[word-break:break-word] absolute bottom-[76.05%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic right-[8.85%] text-[#5b5952] text-[13.166px] top-[20.48%] whitespace-nowrap">Repeatable, capacity-constrained, sold standalone</p>
      <p className="[word-break:break-word] absolute bottom-[71.77%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic right-[19.01%] text-[#5b5952] text-[13.166px] top-[24.76%] whitespace-nowrap">or attached to a delivery engagement.</p>
      <div className="absolute inset-[40%_67.14%_53.81%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[41.07%_81.34%_55.24%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">{`UI/UX & Product`}</p>
      <div className="absolute inset-[48.57%_67.14%_45.24%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[49.64%_76.65%_46.67%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">{`Mobile App & Website`}</p>
      <div className="absolute inset-[57.14%_67.14%_36.67%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[58.21%_68.71%_38.1%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">Custom Software Development</p>
      <div className="absolute inset-[65.71%_67.14%_28.1%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[66.79%_83.68%_29.53%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">SaaS Product</p>
      <div className="absolute inset-[74.29%_67.14%_19.52%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[75.36%_78.35%_20.95%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">Enterprise Software</p>
      <div className="absolute inset-[82.86%_67.14%_10.95%_2.86%]" data-name="Vector">
        <div className="absolute inset-[-2.31%_-0.29%]">
          <svg className="block size-full" fill="none" height="29.8423" preserveAspectRatio="none" viewBox="0 0 231.717 29.8423" width="231.717">
            <path d={svgPaths.p3c8c0200} id="Vector" stroke="#C9C6BE" strokeWidth="1.31657" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[83.93%_84.34%_12.38%_4.86%] leading-[normal] not-italic text-[#14181d] text-[13.714px] whitespace-nowrap">E-commerce</p>
      <div className="absolute inset-[43.1%_64%_14.05%_34.29%]" data-name="Vector">
        <div className="absolute inset-[-0.36%_-5.42%_-0.36%_0]">
          <svg className="block size-full" fill="none" height="198.912" preserveAspectRatio="none" viewBox="0 0 13.8789 198.912" width="13.8789">
            <path d={svgPaths.p1d4d5700} id="Vector" stroke="#9B9891" strokeWidth="1.42629" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[64.52%_54%_35.48%_36%]" data-name="Vector">
        <div className="absolute inset-[-0.71px_0]">
          <svg className="block size-full" fill="none" height="1.42629" preserveAspectRatio="none" viewBox="0 0 76.8 1.42629" width="76.8">
            <path d="M0 0.713143H76.8" id="Vector" stroke="#9B9891" strokeWidth="1.42629" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[42.86%_2.86%_13.81%_47.14%]" data-name="Vector">
        <div className="absolute inset-[-0.41%_-0.21%]">
          <svg className="block size-full" fill="none" height="201.326" preserveAspectRatio="none" viewBox="0 0 385.646 201.326" width="385.646">
            <path d={svgPaths.p194d6a00} id="Vector" stroke="#9333EA" strokeWidth="1.64571" />
          </svg>
        </div>
      </div>
      <p className="[word-break:break-word] absolute bottom-[50.18%] font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-1/2 not-italic right-[30.34%] text-[#14181d] text-[16.457px] top-[45.48%] whitespace-nowrap">Partnership ladder</p>
      <p className="[word-break:break-word] absolute bottom-[44.15%] font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-1/2 not-italic right-[42.58%] text-[#9333ea] text-[13.166px] top-[52.38%] whitespace-nowrap">Discover</p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[52.38%_24.11%_44.15%_58.57%] leading-[normal] not-italic text-[#5b5952] text-[13.166px] whitespace-nowrap">fixed fee, time-boxed</p>
      <p className="[word-break:break-word] absolute bottom-[38.43%] font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-1/2 not-italic right-[45.7%] text-[#9333ea] text-[13.166px] top-[58.1%] whitespace-nowrap">Build</p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[58.1%_21.77%_38.43%_58.57%] leading-[normal] not-italic text-[#5b5952] text-[13.166px] whitespace-nowrap">retained squad, monthly</p>
      <p className="[word-break:break-word] absolute bottom-[32.72%] font-['Inter:Bold',sans-serif] font-bold leading-[normal] left-1/2 not-italic right-[46.61%] text-[#9333ea] text-[13.166px] top-[63.81%] whitespace-nowrap">Run</p>
      <p className="[word-break:break-word] absolute font-['Inter:Regular',sans-serif] font-normal inset-[63.81%_19.94%_32.72%_58.57%] leading-[normal] not-italic text-[#5b5952] text-[13.166px] whitespace-nowrap">managed service, monthly</p>
      <p className="[word-break:break-word] absolute bottom-[25.1%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic right-[7.42%] text-[#5b5952] text-[13.166px] top-[71.43%] whitespace-nowrap">One model for all six. The platform type sets the pod</p>
      <p className="[word-break:break-word] absolute bottom-[20.81%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic right-[16.41%] text-[#5b5952] text-[13.166px] top-[75.71%] whitespace-nowrap">shape, the duration and the risk profile —</p>
      <p className="[word-break:break-word] absolute bottom-[16.53%] font-['Inter:Regular',sans-serif] font-normal leading-[normal] left-1/2 not-italic right-[20.96%] text-[#5b5952] text-[13.166px] top-[80%] whitespace-nowrap">it does not change how you charge.</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[768px] relative shrink-0 w-[768px]" data-name="Container">
      <Image />
    </div>
  );
}

function ContainerMargin() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Container:margin">
      <Container8 />
    </div>
  );
}

function ImageNineNexyraServicesMappedOntoTwoPricingEnginesStudioCatalogueBrandMotionDataVizAndPartnershipLadderDiscoverBuildRun() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[542.4px] items-start overflow-clip p-[40px] relative shrink-0 w-full" data-name="Image - Nine Nexyra services mapped onto two pricing engines: Studio Catalogue (Brand, Motion, Data Viz) and Partnership Ladder (Discover, Build, Run)">
      <ContainerMargin />
    </div>
  );
}

function ImageNineNexyraServicesMappedOntoTwoPricingEnginesStudioCatalogueBrandMotionDataVizAndPartnershipLadderDiscoverBuildRunMargin() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[32px] relative shrink-0 w-full" data-name="Image - Nine Nexyra services mapped onto two pricing engines: Studio Catalogue (Brand, Motion, Data Viz) and Partnership Ladder (Discover, Build, Run):margin">
      <ImageNineNexyraServicesMappedOntoTwoPricingEnginesStudioCatalogueBrandMotionDataVizAndPartnershipLadderDiscoverBuildRun />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-center pt-[16px] relative shrink-0 w-[1119.2px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] text-center whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        The platform type sets the pod shape and duration — it does not change how we charge.
      </p>
    </div>
  );
}

function Section1() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex flex-col items-start max-w-[1280px] px-[24px] py-[56px] relative shrink-0 w-full" data-name="Section">
      <Container6 />
      <ImageNineNexyraServicesMappedOntoTwoPricingEnginesStudioCatalogueBrandMotionDataVizAndPartnershipLadderDiscoverBuildRunMargin />
      <Paragraph8 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[2.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Engine 1 — Studio Catalogue
      </p>
    </div>
  );
}

function Container10() {
  return <div className="bg-[rgba(20,24,29,0.1)] flex-[877.925_0_0] h-px min-w-px relative" data-name="Container" />;
}

function Container9() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[1119.2px]" data-name="Container">
      <Paragraph9 />
      <Container10 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#14181d] text-[35.016px] whitespace-nowrap">
        <p className="leading-[43.77px] mb-0">Fixed price.</p>
        <p className="leading-[43.77px]">Fixed scope.</p>
      </div>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[330.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[331px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Each studio service is scoped, priced, and delivered as a standalone unit. Buy one-off, or pre-purchase a credit pool at a 12% discount and draw down as your calendar demands.
      </p>
    </div>
  );
}

function Container12() {
  return (
    <div className="col-[1/span_4] content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Heading1 />
      <Paragraph10 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] w-[190px]">{`Brand Management & Governance`}</p>
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-[189.325px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[#6d6966] text-[12px] w-[190px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Systematic oversight of brand identity across every touchpoint — guidelines, audits, and governance frameworks that keep the mark consistent as teams scale.
      </p>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-[183.5_0_0] flex-col items-start min-h-px pb-[16px] relative w-[189.325px]" data-name="Container">
      <Paragraph11 />
      <Paragraph12 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        From
      </p>
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pt-[4px] relative shrink-0 w-[189.325px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Mono:Medium',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#14181d] text-[20px] whitespace-nowrap">£2,400</p>
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        per deliverable
      </p>
    </div>
  );
}

function Container16() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] content-stretch flex flex-col h-[79.8px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Paragraph13 />
      <Paragraph14 />
      <Paragraph15 />
    </div>
  );
}

function ContainerMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container16 />
    </div>
  );
}

function Text() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-0 px-[8px] py-[2px] rounded-[26843500px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Brand audit
      </p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-[78.36px] px-[8px] py-[2px] rounded-[26843500px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Guidelines
      </p>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-0 px-[8px] py-[2px] rounded-[26843500px] top-[24.6px]" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Governance
      </p>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[45.2px] relative shrink-0 w-full" data-name="Container">
      <Text />
      <Text1 />
      <Text2 />
    </div>
  );
}

function Container14() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-1 content-stretch flex flex-col items-start justify-self-stretch p-[20px] relative row-1 self-stretch shrink-0" data-name="Container">
      <Container15 />
      <ContainerMargin2 />
      <Container17 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">Creative Production</p>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-[189.337px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[#6d6966] text-[12px] w-[190px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Kinetic brand expressions, UI micro-interactions, explainer sequences, and broadcast-ready motion assets built entirely in-house.
      </p>
    </div>
  );
}

function Container19() {
  return (
    <div className="content-stretch flex flex-col h-[130px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph16 />
      <Paragraph17 />
    </div>
  );
}

function ContainerMargin3() {
  return (
    <div className="content-stretch flex flex-[183.5_0_0] flex-col items-start min-h-px pb-[16px] relative w-full" data-name="Container:margin">
      <Container19 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        From
      </p>
    </div>
  );
}

function Paragraph19() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pt-[4px] relative shrink-0 w-[189.337px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Mono:Medium',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#14181d] text-[20px] whitespace-nowrap">£1,800</p>
    </div>
  );
}

function Paragraph20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        per deliverable
      </p>
    </div>
  );
}

function Container20() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] content-stretch flex flex-col h-[79.8px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Paragraph18 />
      <Paragraph19 />
      <Paragraph20 />
    </div>
  );
}

function ContainerMargin4() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container20 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-0 px-[8px] py-[2px] rounded-[26843500px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        UI motion
      </p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-[68.19px] px-[8px] py-[2px] rounded-[26843500px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Brand video
      </p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-0 px-[8px] py-[2px] rounded-[26843500px] top-[24.6px]" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Explainer
      </p>
    </div>
  );
}

function Container21() {
  return (
    <div className="h-[45.2px] relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Text4 />
      <Text5 />
    </div>
  );
}

function Container18() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-2 content-stretch flex flex-col items-start justify-self-stretch p-[20px] relative row-1 self-stretch shrink-0" data-name="Container">
      <ContainerMargin3 />
      <ContainerMargin4 />
      <Container21 />
    </div>
  );
}

function Paragraph21() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] w-[190px]">{`Infographic & Data Visualisation`}</p>
    </div>
  );
}

function Paragraph22() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[12px] relative shrink-0 w-[189.325px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[19.5px] relative shrink-0 text-[#6d6966] text-[12px] w-[190px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Complex data made legible — editorial infographics, interactive dashboards, and chart systems designed for comprehension at a glance.
      </p>
    </div>
  );
}

function Container23() {
  return (
    <div className="content-stretch flex flex-col h-[149px] items-start relative shrink-0 w-full" data-name="Container">
      <Paragraph21 />
      <Paragraph22 />
    </div>
  );
}

function ContainerMargin5() {
  return (
    <div className="content-stretch flex flex-[183.5_0_0] flex-col items-start min-h-px pb-[16px] relative w-full" data-name="Container:margin">
      <Container23 />
    </div>
  );
}

function Paragraph23() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[1.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        From
      </p>
    </div>
  );
}

function Paragraph24() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start pt-[4px] relative shrink-0 w-[189.325px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Mono:Medium',sans-serif] leading-[28px] not-italic relative shrink-0 text-[#14181d] text-[20px] whitespace-nowrap">£950</p>
    </div>
  );
}

function Paragraph25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        per deliverable
      </p>
    </div>
  );
}

function Container24() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] content-stretch flex flex-col h-[79.8px] items-start pt-[16px] relative shrink-0 w-full" data-name="Container">
      <Paragraph23 />
      <Paragraph24 />
      <Paragraph25 />
    </div>
  );
}

function ContainerMargin6() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[12px] relative shrink-0 w-full" data-name="Container:margin">
      <Container24 />
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-0 px-[8px] py-[2px] rounded-[26843500px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Editorial
      </p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-[62.04px] px-[8px] py-[2px] rounded-[26843500px] top-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Interactive
      </p>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col h-[20.6px] items-start left-0 px-[8px] py-[2px] rounded-[26843500px] top-[24.6px]" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[15px] relative shrink-0 text-[#6d6966] text-[10px] tracking-[0.25px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Dashboard
      </p>
    </div>
  );
}

function Container25() {
  return (
    <div className="h-[45.2px] relative shrink-0 w-full" data-name="Container">
      <Text6 />
      <Text7 />
      <Text8 />
    </div>
  );
}

function Container22() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-3 content-stretch flex flex-col items-start justify-self-stretch p-[20px] relative row-1 self-stretch shrink-0" data-name="Container">
      <ContainerMargin5 />
      <ContainerMargin6 />
      <Container25 />
    </div>
  );
}

function Container13() {
  return (
    <div className="col-[5/span_8] gap-x-[16px] gap-y-[16px] grid grid-cols-[___230.93px_230.94px_230.93px] grid-rows-[_362.09px] justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container14 />
      <Container18 />
      <Container22 />
    </div>
  );
}

function Container11() {
  return (
    <div className="gap-x-[64px] gap-y-[64px] grid grid-cols-[____________34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px] grid-rows-[_362.09px] relative shrink-0 w-full" data-name="Container">
      <Container12 />
      <Container13 />
    </div>
  );
}

function ContainerMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[48px] relative shrink-0 w-full" data-name="Container:margin">
      <Container11 />
    </div>
  );
}

function Paragraph26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">Credit pool pricing</p>
    </div>
  );
}

function Paragraph27() {
  return (
    <div className="content-stretch flex flex-col h-[18px] items-start pt-[2px] relative shrink-0 w-[789.138px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Pre-purchase £5k–£20k of studio credits and draw down at a 12% discount. Valid for 12 months. Ideal for teams with recurring creative needs.
      </p>
    </div>
  );
}

function Container27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-[789.138px]" data-name="Container">
      <Paragraph26 />
      <Paragraph27 />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g id="Icon">
          <path d="M2.29167 5.5H8.70833" id="Vector" stroke="#14181D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
          <path d={svgPaths.p3ed2e300} id="Vector_2" stroke="#14181D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Link6() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex gap-[8px] items-center px-[16px] py-[8px] relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#14181d] text-[11px] tracking-[1.54px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Get credit pool pricing
      </p>
      <Icon1 />
    </div>
  );
}

function Container26() {
  return (
    <div className="bg-[rgba(236,234,229,0.6)] border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex items-center justify-between p-[20px] relative shrink-0 w-full" data-name="Container">
      <Container27 />
      <Link6 />
    </div>
  );
}

function ContainerMargin7() {
  return (
    <div className="content-stretch flex flex-col items-center pt-[40px] relative shrink-0 w-full" data-name="Container:margin">
      <Container26 />
    </div>
  );
}

function Section2() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex flex-col items-start max-w-[1280px] px-[24px] py-[56px] relative shrink-0 w-full" data-name="Section">
      <Container9 />
      <ContainerMargin1 />
      <ContainerMargin7 />
    </div>
  );
}

function Paragraph28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[2.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Engine 2 — Partnership Ladder
      </p>
    </div>
  );
}

function Container29() {
  return <div className="bg-[rgba(20,24,29,0.1)] flex-[860.763_0_0] h-px min-w-px relative" data-name="Container" />;
}

function Container28() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[1119.2px]" data-name="Container">
      <Paragraph28 />
      <Container29 />
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Heading 2">
      <div className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#14181d] text-[35.016px] whitespace-nowrap">
        <p className="leading-[43.77px] mb-0">Discover.</p>
        <p className="leading-[43.77px] mb-0">Build.</p>
        <p className="leading-[43.77px]">Run.</p>
      </div>
    </div>
  );
}

function Paragraph29() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0 w-[330.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[331px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        One engagement model for all six product and engineering services. The platform type shapes the pod; it does not change how we charge.
      </p>
    </div>
  );
}

function Paragraph30() {
  return (
    <div className="content-stretch flex flex-col h-[45px] items-start pt-[28px] relative shrink-0 w-[330.4px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[1.98px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Applies to
      </p>
    </div>
  );
}

function Text9() {
  return <div className="bg-[rgba(147,51,234,0.5)] relative rounded-[26843500px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d6966] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>{`UI/UX & Product Design`}</p>
    </div>
  );
}

function ListItem() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-name="List Item">
      <Text9 />
      <Text10 />
    </div>
  );
}

function Text11() {
  return <div className="bg-[rgba(147,51,234,0.5)] relative rounded-[26843500px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d6966] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>{`Mobile App & Website`}</p>
    </div>
  );
}

function ListItem1() {
  return (
    <div className="content-stretch flex gap-[10px] h-[28px] items-center pt-[8px] relative shrink-0 w-[330.4px]" data-name="List Item">
      <Text11 />
      <Text12 />
    </div>
  );
}

function Text13() {
  return <div className="bg-[rgba(147,51,234,0.5)] relative rounded-[26843500px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text14() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d6966] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Custom Software Development
      </p>
    </div>
  );
}

function ListItem2() {
  return (
    <div className="content-stretch flex gap-[10px] h-[28px] items-center pt-[8px] relative shrink-0 w-[330.4px]" data-name="List Item">
      <Text13 />
      <Text14 />
    </div>
  );
}

function Text15() {
  return <div className="bg-[rgba(147,51,234,0.5)] relative rounded-[26843500px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text16() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d6966] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        SaaS Product
      </p>
    </div>
  );
}

function ListItem3() {
  return (
    <div className="content-stretch flex gap-[10px] h-[28px] items-center pt-[8px] relative shrink-0 w-[330.4px]" data-name="List Item">
      <Text15 />
      <Text16 />
    </div>
  );
}

function Text17() {
  return <div className="bg-[rgba(147,51,234,0.5)] relative rounded-[26843500px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text18() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d6966] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Enterprise Software
      </p>
    </div>
  );
}

function ListItem4() {
  return (
    <div className="content-stretch flex gap-[10px] h-[28px] items-center pt-[8px] relative shrink-0 w-[330.4px]" data-name="List Item">
      <Text17 />
      <Text18 />
    </div>
  );
}

function Text19() {
  return <div className="bg-[rgba(147,51,234,0.5)] relative rounded-[26843500px] shrink-0 size-[6px]" data-name="Text" />;
}

function Text20() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#6d6966] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        E-commerce
      </p>
    </div>
  );
}

function ListItem5() {
  return (
    <div className="content-stretch flex gap-[10px] h-[28px] items-center pt-[8px] relative shrink-0 w-[330.4px]" data-name="List Item">
      <Text19 />
      <Text20 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col h-[172px] items-start pt-[12px] relative shrink-0 w-[330.4px]" data-name="List">
      <ListItem />
      <ListItem1 />
      <ListItem2 />
      <ListItem3 />
      <ListItem4 />
      <ListItem5 />
    </div>
  );
}

function Container31() {
  return (
    <div className="col-[1/span_4] content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Heading2 />
      <Paragraph29 />
      <Paragraph30 />
      <List />
    </div>
  );
}

function Text21() {
  return (
    <div className="content-stretch flex flex-col items-center opacity-40 relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Mono:Medium',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[#9333ea] text-[11px] text-center tracking-[1.76px] uppercase whitespace-nowrap">01</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute border-[#9333ea] border-b-[1.6px] border-solid content-stretch flex gap-[8px] h-[42.6px] items-center left-0 px-[20px] py-[12px] top-0 w-[133.025px]" data-name="Button">
      <Text21 />
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#9333ea] text-[11px] text-center tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Discover
      </p>
    </div>
  );
}

function ButtonMargin() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[133.025px]" data-name="Button:margin">
      <Button />
    </div>
  );
}

function Text22() {
  return (
    <div className="content-stretch flex flex-col items-center opacity-40 relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Mono:Medium',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[#6d6966] text-[11px] text-center tracking-[1.76px] uppercase whitespace-nowrap">02</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b-[1.6px] border-solid content-stretch flex gap-[8px] h-[42.6px] items-center left-0 px-[20px] py-[12px] top-0 w-[104.5px]" data-name="Button">
      <Text22 />
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] text-center tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Build
      </p>
    </div>
  );
}

function ButtonMargin1() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[104.5px]" data-name="Button:margin">
      <Button1 />
    </div>
  );
}

function Text23() {
  return (
    <div className="content-stretch flex flex-col items-center opacity-40 relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Mono:Medium',sans-serif] leading-[16.5px] not-italic relative shrink-0 text-[#6d6966] text-[11px] text-center tracking-[1.76px] uppercase whitespace-nowrap">03</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute border-[rgba(0,0,0,0)] border-b-[1.6px] border-solid content-stretch flex gap-[8px] h-[42.6px] items-center left-0 px-[20px] py-[12px] top-0 w-[92.25px]" data-name="Button">
      <Text23 />
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] text-center tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Run
      </p>
    </div>
  );
}

function ButtonMargin2() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[92.25px]" data-name="Button:margin">
      <Button2 />
    </div>
  );
}

function Container33() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex h-[41.9px] items-start relative shrink-0 w-full" data-name="Container">
      <ButtonMargin />
      <ButtonMargin1 />
      <ButtonMargin2 />
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex flex-col items-start left-[106.55px] px-[10px] py-[2px] rounded-[26843500px] top-[9.2px]" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[0.275px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Fixed fee · time-boxed
      </p>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[31.988px] relative shrink-0 w-full" data-name="Container">
      <p className="[word-break:break-word] absolute font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[32px] left-0 text-[#14181d] text-[24px] top-0 whitespace-nowrap">Discover</p>
      <Text24 />
    </div>
  );
}

function ParagraphMargin1() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[500px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        A focused diagnostic sprint to define scope, validate assumptions, and produce a delivery blueprint before a single line of code is written. Two to four weeks, fee agreed upfront.
      </p>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g id="Icon">
          <path d={svgPaths.p559a000} id="Vector" stroke="#9333EA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin() {
  return (
    <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-name="Icon:margin">
      <Icon2 />
    </div>
  );
}

function Text25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>{`Research & stakeholder audit`}</p>
    </div>
  );
}

function Container37() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-1 content-stretch flex gap-[12px] items-start justify-self-stretch p-[16px] relative row-1 self-stretch shrink-0" data-name="Container">
      <IconMargin />
      <Text25 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g id="Icon">
          <path d={svgPaths.p559a000} id="Vector" stroke="#9333EA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin1() {
  return (
    <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-name="Icon:margin">
      <Icon3 />
    </div>
  );
}

function Text26() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Scope and roadmap document
      </p>
    </div>
  );
}

function Container38() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-2 content-stretch flex gap-[12px] items-start justify-self-stretch p-[16px] relative row-1 self-stretch shrink-0" data-name="Container">
      <IconMargin1 />
      <Text26 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g id="Icon">
          <path d={svgPaths.p559a000} id="Vector" stroke="#9333EA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin2() {
  return (
    <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-name="Icon:margin">
      <Icon4 />
    </div>
  );
}

function Text27() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Risk-rated discovery brief
      </p>
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-1 content-stretch flex gap-[12px] items-start justify-self-stretch p-[16px] relative row-2 self-stretch shrink-0" data-name="Container">
      <IconMargin2 />
      <Text27 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[13px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="13" preserveAspectRatio="none" viewBox="0 0 13 13" width="13">
        <g id="Icon">
          <path d={svgPaths.p559a000} id="Vector" stroke="#9333EA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.08333" />
        </g>
      </svg>
    </div>
  );
}

function IconMargin3() {
  return (
    <div className="content-stretch flex items-start pt-[2px] relative shrink-0" data-name="Icon:margin">
      <Icon5 />
    </div>
  );
}

function Text28() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Text">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[20px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Indicative investment estimate
      </p>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid col-2 content-stretch flex gap-[12px] items-start justify-self-stretch p-[16px] relative row-2 self-stretch shrink-0" data-name="Container">
      <IconMargin3 />
      <Text28 />
    </div>
  );
}

function Container36() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[__356.40px_356.40px] grid-rows-[__53.60px_53.60px] relative shrink-0 w-full" data-name="Container">
      <Container37 />
      <Container38 />
      <Container39 />
      <Container40 />
    </div>
  );
}

function ContainerMargin9() {
  return (
    <div className="content-stretch flex flex-col items-start pb-[28px] pt-[24px] relative shrink-0 w-full" data-name="Container:margin">
      <Container36 />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[11px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="11" preserveAspectRatio="none" viewBox="0 0 11 11" width="11">
        <g id="Icon">
          <path d="M2.29167 5.5H8.70833" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
          <path d={svgPaths.p3ed2e300} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.916667" />
        </g>
      </svg>
    </div>
  );
}

function Link7() {
  return (
    <div className="absolute bg-[#9333ea] content-stretch flex gap-[8px] h-[36.5px] items-center left-0 px-[20px] py-[10px] top-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[11px] text-white tracking-[1.54px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Enquire about Discover
      </p>
      <Icon6 />
    </div>
  );
}

function Container41() {
  return (
    <div className="h-[36.5px] relative shrink-0 w-full" data-name="Container">
      <Link7 />
    </div>
  );
}

function Container34() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[28px] relative shrink-0 w-[724.8px]" data-name="Container">
      <Container35 />
      <ParagraphMargin1 />
      <ContainerMargin9 />
      <Container41 />
    </div>
  );
}

function Container32() {
  return (
    <div className="col-[5/span_8] content-stretch flex flex-col items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Container33 />
      <Container34 />
    </div>
  );
}

function Container30() {
  return (
    <div className="gap-x-[64px] gap-y-[64px] grid grid-cols-[____________34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px_34.60px] grid-rows-[_432.04px] relative shrink-0 w-full" data-name="Container">
      <Container31 />
      <Container32 />
    </div>
  );
}

function ContainerMargin8() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[48px] relative shrink-0 w-full" data-name="Container:margin">
      <Container30 />
    </div>
  );
}

function Text29() {
  return (
    <div className="absolute h-[14.4px] left-0 opacity-50 top-[0.8px] w-[16.725px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['DM_Mono:Medium',sans-serif] leading-[16.5px] left-0 not-italic text-[#9333ea] text-[11px] top-[-1px] tracking-[1.76px] uppercase whitespace-nowrap">01</p>
    </div>
  );
}

function Paragraph31() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-full" data-name="Paragraph">
      <Text29 />
      <p className="[word-break:break-word] absolute font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] left-[22.73px] text-[#9333ea] text-[11px] top-[-0.2px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Discover
      </p>
    </div>
  );
}

function Paragraph32() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[4px] relative shrink-0 w-[331.863px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Fixed fee · time-boxed
      </p>
    </div>
  );
}

function Button3() {
  return (
    <div className="bg-[rgba(243,238,255,0.6)] col-1 content-stretch flex flex-col items-start justify-center justify-self-stretch p-[20px] relative row-1 self-stretch shrink-0" data-name="Button">
      <Paragraph31 />
      <Paragraph32 />
    </div>
  );
}

function Text30() {
  return (
    <div className="absolute h-[14.4px] left-0 opacity-50 top-[0.8px] w-[16.725px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['DM_Mono:Medium',sans-serif] leading-[16.5px] left-0 not-italic text-[#6d6966] text-[11px] top-[-1px] tracking-[1.76px] uppercase whitespace-nowrap">02</p>
    </div>
  );
}

function Paragraph33() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-full" data-name="Paragraph">
      <Text30 />
      <p className="[word-break:break-word] absolute font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] left-[22.73px] text-[#6d6966] text-[11px] top-[-0.2px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Build
      </p>
    </div>
  );
}

function Paragraph34() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[4px] relative shrink-0 w-[331.863px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Retained squad · monthly
      </p>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-white col-2 content-stretch flex flex-col items-start justify-center justify-self-stretch p-[20px] relative row-1 self-stretch shrink-0" data-name="Button">
      <Paragraph33 />
      <Paragraph34 />
    </div>
  );
}

function Text31() {
  return (
    <div className="absolute h-[14.4px] left-0 opacity-50 top-[0.8px] w-[16.725px]" data-name="Text">
      <p className="[word-break:break-word] absolute font-['DM_Mono:Medium',sans-serif] leading-[16.5px] left-0 not-italic text-[#6d6966] text-[11px] top-[-1px] tracking-[1.76px] uppercase whitespace-nowrap">03</p>
    </div>
  );
}

function Paragraph35() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-full" data-name="Paragraph">
      <Text31 />
      <p className="[word-break:break-word] absolute font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] left-[22.72px] text-[#6d6966] text-[11px] top-[-0.2px] tracking-[1.76px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Run
      </p>
    </div>
  );
}

function Paragraph36() {
  return (
    <div className="content-stretch flex flex-col h-[20px] items-start pt-[4px] relative shrink-0 w-[331.875px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Managed service · monthly
      </p>
    </div>
  );
}

function Button5() {
  return (
    <div className="bg-white col-3 content-stretch flex flex-col items-start justify-center justify-self-stretch p-[20px] relative row-1 self-stretch shrink-0" data-name="Button">
      <Paragraph35 />
      <Paragraph36 />
    </div>
  );
}

function Container42() {
  return (
    <div className="bg-[rgba(20,24,29,0.1)] border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid gap-x-px gap-y-px grid grid-cols-[___371.86px_371.86px_371.88px] grid-rows-[_76.49px] h-[78.088px] overflow-clip relative shrink-0 w-full" data-name="Container">
      <Button3 />
      <Button4 />
      <Button5 />
    </div>
  );
}

function ContainerMargin10() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[40px] relative shrink-0 w-full" data-name="Container:margin">
      <Container42 />
    </div>
  );
}

function Section3() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex flex-col items-start max-w-[1280px] px-[24px] py-[56px] relative shrink-0 w-full" data-name="Section">
      <Container28 />
      <ContainerMargin8 />
      <ContainerMargin10 />
    </div>
  );
}

function Paragraph37() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[16.5px] relative shrink-0 text-[#6d6966] text-[11px] tracking-[2.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Common questions
      </p>
    </div>
  );
}

function Container44() {
  return <div className="bg-[rgba(20,24,29,0.1)] flex-[954.013_0_0] h-px min-w-px relative" data-name="Container" />;
}

function Container43() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-[1119.2px]" data-name="Container">
      <Paragraph37 />
      <Container44 />
    </div>
  );
}

function Paragraph38() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">Can I mix a studio service with a Build engagement?</p>
    </div>
  );
}

function Paragraph39() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[351.725px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[352px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Yes. Studio services can be attached to any delivery engagement or bought standalone. Many clients run an active Build pod alongside a monthly motion retainer.
      </p>
    </div>
  );
}

function Container46() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] col-1 content-stretch flex flex-col items-start justify-self-stretch pt-[20px] relative row-1 self-stretch shrink-0" data-name="Container">
      <Paragraph38 />
      <Paragraph39 />
    </div>
  );
}

function Paragraph40() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">Do prices include VAT?</p>
    </div>
  );
}

function Paragraph41() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[351.738px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[352px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        All prices shown are exclusive of UK VAT at the prevailing rate. VAT invoices are issued to UK-registered clients. Overseas clients pay net of UK VAT.
      </p>
    </div>
  );
}

function Container47() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] col-2 content-stretch flex flex-col items-start justify-self-stretch pt-[20px] relative row-1 self-stretch shrink-0" data-name="Container">
      <Paragraph40 />
      <Paragraph41 />
    </div>
  );
}

function Paragraph42() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">How does a credit pool work?</p>
    </div>
  );
}

function Paragraph43() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[351.725px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[352px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        You pre-purchase a block of studio credits in £5k increments. Credits are drawn against scoped deliverables at a 12% discount. Unused credits expire after 12 months.
      </p>
    </div>
  );
}

function Container48() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] col-3 content-stretch flex flex-col items-start justify-self-stretch pt-[20px] relative row-1 self-stretch shrink-0" data-name="Container">
      <Paragraph42 />
      <Paragraph43 />
    </div>
  );
}

function Paragraph44() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">{`What does 'time-boxed' mean for Discover?`}</p>
    </div>
  );
}

function Paragraph45() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[351.725px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[352px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        A Discover sprint runs for a fixed two to four weeks depending on scope. The fee is agreed upfront, the brief is locked on day one, and nothing runs over.
      </p>
    </div>
  );
}

function Container49() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] col-1 content-stretch flex flex-col items-start justify-self-stretch pt-[20px] relative row-2 self-stretch shrink-0" data-name="Container">
      <Paragraph44 />
      <Paragraph45 />
    </div>
  );
}

function Paragraph46() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">How long is a typical Build engagement?</p>
    </div>
  );
}

function Paragraph47() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[351.738px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[352px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Most Build engagements run three to twelve months on a rolling monthly contract with 30 days notice. Longer engagements attract a small loyalty discount.
      </p>
    </div>
  );
}

function Container50() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] col-2 content-stretch flex flex-col items-start justify-self-stretch pt-[20px] relative row-2 self-stretch shrink-0" data-name="Container">
      <Paragraph46 />
      <Paragraph47 />
    </div>
  );
}

function Paragraph48() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[19.25px] relative shrink-0 text-[#14181d] text-[14px] whitespace-nowrap">Can we go straight to Build without Discover?</p>
    </div>
  );
}

function Paragraph49() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-[351.725px]" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[22.75px] relative shrink-0 text-[#6d6966] text-[14px] w-[352px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        If you arrive with an approved spec or prior discovery work, yes. We will review it and advise on any gaps before the Build pod is assembled.
      </p>
    </div>
  );
}

function Container51() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] col-3 content-stretch flex flex-col items-start justify-self-stretch pt-[20px] relative row-2 self-stretch shrink-0" data-name="Container">
      <Paragraph48 />
      <Paragraph49 />
    </div>
  );
}

function Container45() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[___351.73px_351.74px_351.73px] grid-rows-[__139.05px_116.30px] relative shrink-0 w-full" data-name="Container">
      <Container46 />
      <Container47 />
      <Container48 />
      <Container49 />
      <Container50 />
      <Container51 />
    </div>
  );
}

function ContainerMargin11() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[40px] relative shrink-0 w-full" data-name="Container:margin">
      <Container45 />
    </div>
  );
}

function Section4() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-b-[0.8px] border-solid content-stretch flex flex-col items-start max-w-[1280px] px-[24px] py-[56px] relative shrink-0 w-full" data-name="Section">
      <Container43 />
      <ContainerMargin11 />
    </div>
  );
}

function Paragraph50() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[16.5px] relative shrink-0 text-[#9333ea] text-[11px] tracking-[2.2px] uppercase whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Not sure where to start?
      </p>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex flex-col h-[137px] items-start pt-[20px] relative shrink-0 w-[639.475px]" data-name="Heading 2">
      <div className="[word-break:break-word] font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold leading-[0] relative shrink-0 text-[#14181d] text-[46.688px] whitespace-nowrap">
        <p className="leading-[58.36px] mb-0">Not sure which engine</p>
        <p className="leading-[58.36px]">fits your project?</p>
      </div>
    </div>
  );
}

function ParagraphMargin2() {
  return (
    <div className="content-stretch flex flex-col items-start pt-[16px] relative shrink-0" data-name="Paragraph:margin">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[29.25px] relative shrink-0 text-[#6d6966] text-[18px] w-[448px]" style={{ fontVariationSettings: '"opsz" 14' }}>
        Book a no-obligation 30-minute call. We will listen to what you need and tell you honestly which model — and which services — make sense.
      </p>
    </div>
  );
}

function Container53() {
  return (
    <div className="col-[1/span_7] content-stretch flex flex-col h-[256.95px] items-start justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <Paragraph50 />
      <Heading3 />
      <ParagraphMargin2 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="14" preserveAspectRatio="none" viewBox="0 0 14 14" width="14">
        <g id="Icon">
          <path d="M2.91667 7H11.0833" id="Vector" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.pf23dd00} id="Vector_2" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Link8() {
  return (
    <div className="bg-[#9333ea] content-stretch flex gap-[8px] items-center px-[24px] py-[14px] relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold',sans-serif] font-semibold leading-[20px] relative shrink-0 text-[14px] text-white tracking-[0.35px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Book a discovery call
      </p>
      <Icon7 />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" height="12" preserveAspectRatio="none" viewBox="0 0 12 12" width="12">
        <g id="Icon">
          <path d="M7.5 1.5H10.5V4.5" id="Vector" stroke="#14181D" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 7L10.5 1.5" id="Vector_2" stroke="#14181D" strokeLinecap="round" strokeLinejoin="round" />
          <path d={svgPaths.pc1a2200} id="Vector_3" stroke="#14181D" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function Link9() {
  return (
    <div className="bg-white border-[0.8px] border-[rgba(20,24,29,0.1)] border-solid content-stretch flex gap-[8px] items-center px-[24px] py-[14px] relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Medium',sans-serif] font-medium leading-[20px] relative shrink-0 text-[#14181d] text-[14px] tracking-[0.35px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        View our work
      </p>
      <Icon8 />
    </div>
  );
}

function Container54() {
  return (
    <div className="col-[8/span_5] content-stretch flex flex-col gap-[12px] items-end justify-self-stretch relative row-1 self-center shrink-0" data-name="Container">
      <Link8 />
      <Link9 />
    </div>
  );
}

function Container52() {
  return (
    <div className="gap-x-[32px] gap-y-[32px] grid grid-cols-[____________63.92px_63.92px_63.92px_63.92px_63.92px_63.92px_63.92px_63.92px_63.92px_63.92px_63.92px_63.92px] grid-rows-[_256.95px] relative shrink-0 w-full" data-name="Container">
      <Container53 />
      <Container54 />
    </div>
  );
}

function Section5() {
  return (
    <div className="content-stretch flex flex-col items-start max-w-[1280px] px-[24px] py-[80px] relative shrink-0 w-full" data-name="Section">
      <Container52 />
    </div>
  );
}

function MainContent() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Main Content">
      <Section />
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
    </div>
  );
}

function Container56() {
  return (
    <div className="[word-break:break-word] h-[15.988px] leading-[16px] relative shrink-0 text-[12px] w-[344.475px] whitespace-nowrap" data-name="Container">
      <p className="absolute font-['Hanken_Grotesk:SemiBold',sans-serif] font-semibold left-0 text-[#14181d] top-0 tracking-[2.16px] uppercase">Nexyra</p>
      <p className="absolute font-['Hanken_Grotesk:Light',sans-serif] font-light left-[64.69px] text-[#6d6966] top-0 tracking-[2.16px] uppercase">Consulting</p>
      <p className="absolute font-['DM_Sans:Regular',sans-serif] font-normal left-[171.1px] text-[#6d6966] top-0" style={{ fontVariationSettings: '"opsz" 14' }}>{`· Registered in England & Wales`}</p>
    </div>
  );
}

function Link10() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Privacy
      </p>
    </div>
  );
}

function Link11() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Terms
      </p>
    </div>
  );
}

function Link12() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Link">
      <p className="[word-break:break-word] font-['DM_Sans:Regular',sans-serif] font-normal leading-[16px] relative shrink-0 text-[#6d6966] text-[12px] whitespace-nowrap" style={{ fontVariationSettings: '"opsz" 14' }}>
        Accessibility
      </p>
    </div>
  );
}

function Container57() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0" data-name="Container">
      <Link10 />
      <Link11 />
      <Link12 />
    </div>
  );
}

function Container55() {
  return (
    <div className="content-stretch flex items-center justify-between max-w-[1280px] px-[24px] py-[32px] relative shrink-0 w-full" data-name="Container">
      <Container56 />
      <Container57 />
    </div>
  );
}

function Footer() {
  return (
    <div className="border-[rgba(20,24,29,0.1)] border-solid border-t-[0.8px] content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Footer">
      <Container55 />
    </div>
  );
}

function App() {
  return (
    <div className="bg-[#f8f7f4] content-stretch flex flex-col items-start min-h-[694.4000244140625px] relative shrink-0 w-full" data-name="App">
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

function Body() {
  return (
    <div className="content-stretch flex flex-col h-[694.4px] items-start relative shrink-0 w-[1167.2px]" data-name="Body">
      <App />
    </div>
  );
}

export default function CreatePricingPage() {
  return (
    <div className="bg-[#f8f7f4] content-stretch flex flex-col items-start relative size-full" data-name="Create pricing page">
      <Body />
    </div>
  );
}