document.addEventListener("DOMContentLoaded", function () {
  const btnProcess = document.getElementById("btn-process");

  if (btnProcess) {
    btnProcess.addEventListener("click", generateRecommendation);
  }

  const masterCrops = [
    { name: "มันสำปะหลัง", soils: ["sandy", "sandy-loam", "loam"], water: "น้อย", sun: "แดดจัด 100%", season: "ต้นฝน/ปลายฝน", how: "ยกร่องแปลง ปักท่อนพันธุ์เอียง 45 องศา" },
    { name: "อ้อยโรงงาน", soils: ["loam", "clay-loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ปลายฤดูฝน", how: "ยกร่องวางท่อนพันธุ์ ให้ปุ๋ยบำรุงกอ" },
    { name: "ข้าวโพดเลี้ยงสัตว์", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฝน/หลังนา", how: "หยอดเมล็ดลึก 3-5 ซม. เว้นระยะ 20x75 ซม." },
    { name: "แตงโม", soils: ["sandy", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "แล้ง/หลังนา", how: "ยกร่องแปลง หยอดเมล็ด คัดเหลือผลสมบูรณ์" },
    { name: "สับปะรด", soils: ["sandy", "sandy-loam"], water: "น้อย", sun: "แดดจัด 100%", season: "ตลอดปี", how: "ใช้หน่อปลูก ระยะ 30x50 ซม." },
    { name: "พริกขี้หนู / พริกจินดา", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ตลอดปี", how: "เพาะกล้า 30 วัน ย้ายลงแปลงคลุมพลาสติก" },
    { name: "แก้วมังกร", soils: ["sandy-loam", "loam"], water: "น้อย", sun: "แดดจัด 100%", season: "ตลอดปี", how: "ตั้งเสาปูนสูง 1.5 เมตร ปลูกกิ่งรอบเสา" },
    { name: "มะม่วง", soils: ["loam", "sandy-loam", "clay-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "ขุดหลุม 50x50 ซม. ตัดแต่งทรงพุ่มโปร่ง" },
    { name: "ข้าวหอมมะลิ", soils: ["clay", "clay-loam", "loam"], water: "ต้องการน้ำมาก", sun: "แดดจัด 100%", season: "ฤดูฝน", how: "ไถดะตากดิน ทำแปลงปักดำหรือหว่านน้ำตม" },
    { name: "มะพร้าวน้ำหอม", soils: ["clay-loam", "loam", "clay"], water: "มาก", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "วางผลพันธุ์เอียง 45 องศา หันจุกไปทางทิศตะวันออก" },
    { name: "มะนาว", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "ปลูกในวงบ่อซีเมนต์เพื่อควบคุมการให้น้ำ" },
    { name: "ฟักทอง", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ปลายฝน/หลังนา", how: "หยอดเมล็ดหลุมละ 3-4 เมล็ด ผสมเกสรเช้า" },
    { name: "ถั่วเหลือง / ถั่วเขียว", soils: ["loam", "clay-loam", "sandy-loam"], water: "น้อย-ปานกลาง", sun: "แดดจัด 100%", season: "หลังนา", how: "หว่านหลังเกี่ยวข้าว ช่วยบำรุงดิน" },
    { name: "กล้วยน้ำว้า", soils: ["loam", "clay-loam"], water: "มาก", sun: "แดดจัด 80-100%", season: "ต้นฤดูฝน", how: "ขุดหลุม 50 ซม. วางหน่อพันธุ์ แต่งหน่อคุมกอ" },
    { name: "ทุเรียน", soils: ["loam", "sandy-loam", "clay-loam"], water: "ปานกลาง-มาก", sun: "แดด 70-100%", season: "ต้นฤดูฝน", how: "ขุดโคกสูงป้องกันน้ำขังโคน" },
    { name: "ยางพารา", soils: ["sandy-loam", "loam", "clay-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ต้นฤดูฝน", how: "ปลูกระยะ 3x7 เมตร ขุดหลุมใส่ปุ๋ยรองก้น" },
    { name: "ปาล์มน้ำมัน", soils: ["clay-loam", "loam", "peat"], water: "มาก", sun: "แดดจัด 100%", season: "ฤดูฝน", how: "ปลูกระยะสามเหลี่ยม 9x9x9 เมตร" },
    { name: "ผักสลัด", soils: ["loam", "peat"], water: "ปานกลาง", sun: "แดด 50-80%", season: "ฤดูหนาว", how: "เพาะกล้า 15 วัน ย้ายลงแปลงใส่ปุ๋ยหมัก" },
    { name: "มังคุด", soils: ["loam", "clay-loam"], water: "มาก", sun: "แดดรำไรถึงจัด", season: "ต้นฤดูฝน", how: "ปลูกระยะ 8x8 เมตร บังแสงช่วงแรก" },
    { name: "มะเขือเทศ", soils: ["loam", "sandy-loam"], water: "ปานกลาง", sun: "แดดจัด 100%", season: "ฤดูหนาว", how: "เพาะกล้า ย้ายปลูกปักค้างไม้ไผ่" }
  ];

  function generateRecommendation() {
    const selectedSoil = document.getElementById("soil-select").value;
    const selectedProvince = document.getElementById("province-select").value;

    const resultSection = document.getElementById("result-section");
    const tableBody = document.getElementById("crop-table-body");
    const resultTitle = document.getElementById("result-title");
    const provinceDetail = document.getElementById("province-detail");

    // คำนวณคะแนน
    const scoredCrops = masterCrops.map(crop => {
      let score = 0;
      if (crop.soils.includes(selectedSoil)) {
        score += 50;
      } else {
        score += 20;
      }

      let reason = `เหมาะสมกับสภาพดินและสภาพอากาศของจังหวัด${selectedProvince}`;
      if (crop.soils.includes(selectedSoil)) {
        reason += ` (ตรงกับชนิดเนื้อดิน ${selectedSoil})`;
      }

      return { ...crop, score, reason };
    });

    // เรียงลำดับคะแนน
    scoredCrops.sort((a, b) => b.score - a.score);

    // แสดงผลบนหน้าเว็บ
    resultTitle.innerText = `ตารางจัดอันดับพืชที่เหมาะสมสำหรับ "จังหวัด${selectedProvince}"`;
    provinceDetail.innerHTML = `📍 <strong>ข้อมูลประมวลผล:</strong> จังหวัด${selectedProvince} | ชนิดดิน: ${selectedSoil}`;

    tableBody.innerHTML = "";
    scoredCrops.forEach((crop, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td style="text-align: center;"><span class="badge-rank">${index + 1}</span></td>
        <td><strong>${crop.name}</strong></td>
        <td>${crop.reason}</td>
        <td>💧 ${crop.water}</td>
        <td>☀️ ${crop.sun}</td>
        <td>🗓️ ${crop.season}</td>
        <td>🛠️ ${crop.how}</td>
      `;
      tableBody.appendChild(row);
    });

    // แสดงกล่องผลลัพธ์
    resultSection.classList.remove("hidden");
    resultSection.scrollIntoView({ behavior: "smooth" });
  }
});

