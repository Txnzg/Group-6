// 1. ฐานข้อมูลคุณลักษณะเฉพาะเฉพาะจังหวัด (Specific Provincial Profiles)
const provinceProfiles = {
  "เชียงใหม่": { temp: "cool", rainfall: "medium", mainPicks: ["ชา/กาแฟอาราบิก้า", "ผักสลัดเมืองหนาว", "สตรอว์เบอร์รี", "กระเทียม", "ลำไย"], desc: "พื้นที่สูง อุณหภูมิเฉลี่ยต่ำ หนาวเย็นบนดอย ดินระบายน้ำดี" },
  "เชียงราย": { temp: "cool", rainfall: "high", mainPicks: ["ชา/กาแฟอาราบิก้า", "สตรอว์เบอร์รี", "สับปะรดนางแล", "ข้าวหอมเชียงราย", "ยางพารา"], desc: "หนาวเย็น มีความชื้นสูง พื้นที่ราบสลับภูเขา" },
  "จันทบุรี": { temp: "warm", rainfall: "very-high", mainPicks: ["ทุเรียน", "มังคุด", "สละ", "เงาะ", "พริกไทย"], desc: "ปริมาณน้ำฝนชุกมาก ความชื้นสัมพัทธ์สูง เหมาะแก่ไม้ผลเขตร้อน" },
  "ตราด": { temp: "warm", rainfall: "very-high", mainPicks: ["ทุเรียน", "มังคุด", "ยางพารา", "สับปะรดตราดสีทอง", "เงาะ"], desc: "ฝนตกชุกตลอดปี ดินมีความชื้นสูงมาก" },
  "นครราชสีมา": { temp: "hot", rainfall: "low", mainPicks: ["มันสำปะหลัง", "ข้าวโพดเลี้ยงสัตว์", "อ้อยโรงงาน", "พริกขี้หนู", "มะม่วง"], desc: "ที่ราบสูง ดินทรายปนร่วน สภาพอากาศแห้งแล้ง" },
  "ขอนแก่น": { temp: "hot", rainfall: "medium-low", mainPicks: ["อ้อยโรงงาน", "มันสำปะหลัง", "ข้าวหอมมะลิ", "ถั่วเหลือง", "มะพร้าว"], desc: "อากาศร้อนแห้งแล้ง ดินทราย รักษาน้ำได้น้อย" },
  "สุราษฎร์ธานี": { temp: "warm", rainfall: "high", mainPicks: ["ยางพารา", "ปาล์มน้ำมัน", "เงาะโรงเรียน", "ทุเรียน", "มะพร้าว"], desc: "มรสุมเข้าตลอดปี ปริมาณน้ำฝนสูง ไม่มีฤดูหนาว" },
  "สงขลา": { temp: "warm", rainfall: "high", mainPicks: ["ยางพารา", "ปาล์มน้ำมัน", "จำปาดะ", "ส้มโอหอมทำการ", "ข้าวไร่"], desc: "ฝนแปดแดดสี่ มีความชื้นสูงตลอดปี" },
  "สุพรรณบุรี": { temp: "warm", rainfall: "medium", mainPicks: ["ข้าวเจ้า", "แห้ว", "มะนาว", "อ้อยโรงงาน", "เมล่อน"], desc: "ที่ราบลุ่มชลประทานอุดมสมบูรณ์ แหล่งน้ำเข้าถึงดี" },
  "กรุงเทพมหานคร": { temp: "warm", rainfall: "medium", mainPicks: ["กล้วยไม้", "ผักสวนครัว", "มัสตาร์ด/ผักกาด", "มะพร้าวน้ำหอม", "ฝรั่ง"], desc: "ที่ราบลุ่มต่ำ ดินเหนียวอุดมด้วยอินทรียวัตถุ" }
};

// ข้อมูลพื้นฐานเริ่มต้นสำหรับจังหวัดอื่นๆ ที่เหลือ (Fallback Profile Calculator)
const defaultProvinceProfile = (name) => {
  return {
    temp: "warm",
    rainfall: "medium",
    mainPicks: ["ข้าวหอมมะลิ", "มันสำปะหลัง", "ข้าวโพดเลี้ยงสัตว์", "กล้วยน้ำว้า", "พริกจินดา"],
    desc: `พื้นที่เกษตรกรรมเฉพาะของจังหวัด${name} ปรับตามสภาพดินและแหล่งน้ำท้องถิ่น`
  };
};

// 2. คลังข้อมูลพืชเกษตรหลัก 20 ชนิด
const masterCrops = [
  { name: "ข้าวหอมมะลิ / ข้าวเจ้า", soils: ["clay", "clay-loam", "loam"], water: "ต้องการน้ำมาก", sun: "แดดจัด 100%", season: "ฤดูฝน (นาปี)", how: "ไถดะตากดิน ทำแปลงปักดำหรือหว่านน้ำตม รักษาระดับน้ำขัง 5-10 ซม." },
  { name: "มันสำปะหลัง", soils: ["sandy", "sandy-loam", "loam"], water: "น้อย (ทนแล้ง)", sun: "แดดจัด 100%", season: "ต้นฤดูฝน / ปลายฝน", how: "ยกร่องแปลง ปักท่อนพันธุ์เอียง 45 องศา ระวังอย่าให้น้ำขังโคน" },
  { name: "อ้อยโรงงาน", soils: ["loam", "clay-loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ปลายฤดูฝน", how: "ยกร่องวางท่อนพันธุ์ ให้ปุ๋ยบำรุงกอช่วงย่างเข้าฤดูฝน" },
  { name: "ข้าวโพดเลี้ยงสัตว์", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฝน / หลังนา", how: "หยอดเมล็ดลึก 3-5 ซม. เว้นระยะ 20x75 ซม. กำจัดวัชพืชสม่ำเสมอ" },
  { name: "ทุเรียน", soils: ["loam", "sandy-loam", "clay-loam"], water: "ปานกลาง-มาก (ห้ามขัง)", sun: "แดด 70-100%", season: "ต้นฤดูฝน", how: "ขุดโคกสูง防น้ำขัง ให้น้ำผ่านระบบสปริงเกลอร์สม่ำเสมอ" },
  { name: "ยางพารา", soils: ["sandy-loam", "loam", "clay-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "ปลูกระยะ 3x7 เมตร ขุดหลุมรองก้นด้วยปุ๋ยร็อคเฟสเฟต" },
  { name: "ปาล์มน้ำมัน", soils: ["clay-loam", "loam", "peat"], water: "มาก", sun: "แดดจัด 100%", season: "ฤดูฝน", how: "ปลูกระยะสามเหลี่ยม 9x9x9 เมตร ตัดแต่งทางใบสม่ำเสมอ" },
  { name: "สตรอว์เบอร์รี / ชา / กาแฟ", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดด 60-80%", season: "ฤดูหนาว / ต้นฝน", how: "ปลูกบนพื้นที่สูงยกร่อง คลุมฟางข้าวเพื่อรักษาความชื้นหน้าดิน" },
  { name: "พริกขี้หนู / พริกจินดา", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ปลูกได้ทุกฤดู", how: "เพาะกล้า 30 วัน ย้ายลงแปลงใช้พลาสติกคลุมแปลงเพื่อลดวัชพืช" },
  { name: "มะม่วง", soils: ["loam", "sandy-loam", "clay-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "ขุดหลุม 50x50 ซม. ตัดแต่งทรงพุ่มโปร่งเพื่อให้แสงส่องทั่วถึง" },
  { name: "กล้วยหอม / กล้วยน้ำว้า", soils: ["loam", "clay-loam"], water: "มาก", sun: "แดดจัด 80-100%", season: "ต้นฤดูฝน", how: "ขุดหลุม 50 ซม. วางหน่อพันธุ์ แต่งหน่อให้เหลือ 1-2 หน่อต่อกอ" },
  { name: "แตงโม", soils: ["sandy", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "แล้ง / หลังนา", how: "ยกร่องแปลง หยอดเมล็ด คัดเหลือผลสมบูรณ์ที่สุด 1-2 ผล/ต้น" },
  { name: "ผักสลัดเมืองหนาว", soils: ["loam", "peat"], water: "ปานกลาง (รดฝอย)", sun: "แดด 50-80%", season: "ฤดูหนาว", how: "เพาะกล้า 15 วัน ย้ายลงแปลงใส่ปุ๋ยหมัก เก็บเกี่ยวอายุ 40-45 วัน" },
  { name: "มังคุด", soils: ["loam", "clay-loam"], water: "มาก", sun: "แดดรำไรถึงจัด", season: "ต้นฤดูฝน", how: "ปลูกระยะ 8x8 เมตร บังแสงช่วงแรก ให้น้ำสม่ำเสมอช่วงติดผล" },
  { name: "สับปะรด", soils: ["sandy", "sandy-loam"], water: "น้อย", sun: "แดดจัด 100%", season: "ปลูกได้ตลอดปี", how: "ใช้หน่อปลูก ระยะ 30x50 ซม. บังคับออกดอกด้วยสารเร่งเมื่อสมบูรณ์" },
  { name: "มะพร้าวน้ำหอม", soils: ["clay-loam", "loam", "clay"], water: "มาก", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "วางผลพันธุ์เอียง 45 องศา หันจุกไปทางทิศตะวันออก ใส่เกลือรอบโคน" },
  { name: "มะนาว", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "นิยมปลูกในวงบ่อซีเมนต์เพื่อควบคุมการให้น้ำและบังคับออกดอก" },
  { name: "แก้วมังกร", soils: ["sandy-loam", "loam"], water: "น้อย", sun: "แดดจัด 100%", season: "ปลูกได้ตลอดปี", how: "ตั้งเสาปูนสูง 1.5 เมตร ปลูก 3-4 กิ่งรอบเสา ทำค้างด้านบน" },
  { name: "ฟักทอง", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ปลายฝน / หลังนา", how: "หยอดเมล็ดหลุมละ 3-4 เมล็ด ผสมเกสรด้วยมือช่วงเช้าเพิ่มการติดผล" },
  { name: "ถั่วเหลือง / ถั่วเขียว", soils: ["loam", "clay-loam", "sandy-loam"], water: "น้อย-ปานกลาง", sun: "แดดจัด 100%", season: "หลังการทำนา", how: "หว่านหลังเกี่ยวข้าว ช่วยบำรุงดินและเพิ่มไนโตรเจนในดิน" }
];

// 3. ฟังก์ชันประมวลผลจัดอันดับเฉพาะจังหวัดและชนิดดิน
function generateRecommendation() {
  const selectedSoil = document.getElementById('soil-select').value;
  const selectedProvince = document.getElementById('province-select').value;

  const resultSection = document.getElementById('result-section');
  const tableBody = document.getElementById('crop-table-body');
  const resultTitle = document.getElementById('result-title');
  const provinceDetail = document.getElementById('province-detail');

  // ดึงข้อมูลโปรไฟล์เฉพาะของจังหวัด
  const profile = provinceProfiles[selectedProvince] || defaultProvinceProfile(selectedProvince);

  // อัลกอริทึมคำนวณคะแนนระดับจังหวัด (Dynamic Provincial Scoring)
  const scoredCrops = masterCrops.map(crop => {
    let score = 0;

    // 1. คะแนนตรงกับชนิดดิน (40 คะแนน)
    if (crop.soils.includes(selectedSoil)) score += 40;

    // 2. คะแนนพืชเด่นประจำจังหวัด (Specific Crop Rank - 40 คะแนน)
    const isMainPick = profile.mainPicks.some(pick => crop.name.includes(pick) || pick.includes(crop.name.split(" ")[0]));
    if (isMainPick) score += 40;

    // 3. คะแนนความเหมาะสมทางกายภาพ (สภาพอากาศ/น้ำฝนประจำจังหวัด - 20 คะแนน)
    if (profile.rainfall === "very-high" && (crop.water.includes("มาก") || crop.name.includes("ทุเรียน"))) score += 20;
    if (profile.temp === "cool" && (crop.name.includes("สลัด") || crop.name.includes("สตรอว์เบอร์รี") || crop.name.includes("ชา"))) score += 20;
    if (profile.temp === "hot" && (crop.name.includes("มันสำปะหลัง") || crop.name.includes("อ้อย") || crop.name.includes("แตงโม"))) score += 20;

    // สร้างเหตุผลจำเพาะเจาะจงรายจังหวัด
    let specificReason = `สภาพดิน ${selectedSoil} และสภาพอากาศของจังหวัด${selectedProvince} `;
    if (isMainPick) {
      specificReason += `ตรงกับพืชเศรษฐกิจแนะนำของจังหวัด (${profile.desc})`;
    } else if (crop.soils.includes(selectedSoil)) {
      specificReason += `มีคุณลักษณะเนื้อดินที่เอื้อต่อการเจริญเติบโตของระบบรากพืชชนิดนี้`;
    } else {
      specificReason += `สามารถปลูกได้แต่ต้องปรับปรุงบำรุงดินและจัดการน้ำเพิ่มเติม`;
    }

    return { ...crop, score, specificReason };
  });

  // เรียงลำดับจากคะแนนมากไปน้อย (TOP 20)
  scoredCrops.sort((a, b) => b.score - a.score);

  // อัปเดต UI
  resultTitle.innerText = `ตารางจัดอันดับ TOP 20 พืชที่เหมาะสมสำหรับ "จังหวัด${selectedProvince}"`;
  provinceDetail.innerHTML = `📍 <strong>ลักษณะกายภาพเฉพาะจังหวัด:</strong> ${profile.desc}`;

  tableBody.innerHTML = "";
  scoredCrops.forEach((crop, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td style="text-align: center;"><span class="badge-rank">${index + 1}</span></td>
      <td><strong>${crop.name}</strong></td>
      <td>${crop.specificReason}</td>
      <td>💧 ${crop.water}</td>
      <td>☀️ ${crop.sun}</td>
      <td>🗓️ ${crop.season}</td>
      <td>🛠️ ${crop.how}</td>
    `;
    tableBody.appendChild(row);
  });

  resultSection.classList.remove('hidden');
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

