// ================= ตั้งค่า API Key =================
// นำ API Key ที่ได้จาก Google AI Studio มาแปะแทนที่ช่องสี่เหลี่ยมด้านล่างนี้
const GEMINI_API_KEY = "ใส่_GEMINI_API_KEY_ตรงนี้"; 

// ฟังก์ชันสลับหน้าแท็บ (Tab Switcher)
function switchTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// ================= ฟีเจอร์ที่ 1 (วิเคราะห์ดิน + ดัชนี pH/ธาตุอาหาร + Top 5) =================
async function analyzeFeature1() {
  const soil = document.getElementById('f1-soil').value;
  const resultDiv = document.getElementById('f1-result');
  
  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = "<p class='loading'>🤖 กำลังวิเคราะห์เจาะลึกชนิดดิน ดัชนี pH และจัดอันดับพืช...</p>";

  const prompt = `ผู้ใช้เลือกชนิดดินเป็น "${soil}"
  ช่วยวิเคราะห์ดินชนิดนี้อย่างละเอียดเป็นภาษาไทย โดยจัดทำข้อมูลตามหัวข้อต่อไปนี้:

  1. 📊 **ดัชนีและคุณสมบัติทางกายภาพของดิน:**
     - ช่วงค่า pH ปกติของดินชนิดนี้
     - ความสามารถในการอุ้มน้ำ (Water Holding Capacity)
     - การถ่ายเทอากาศและความหนาแน่นของดิน
     - ปริมาณธาตุอาหารหลัก (N-P-K) เบื้องต้น

  2. 🏆 **Top 5 พืชที่เหมาะสมที่สุด (เรียงอันดับ 1 ถึง 5):**
     สำหรับพืชแต่ละชนิด ระบุ:
     - **อันดับที่ X: [ชื่อพืช]**
     - **เหตุผลที่เหมาะ:**
     - **ข้อดี:**
     - **ข้อเสีย / ข้อจำกัด:**
     - **ความต้องการแสง:** (เช่น แดดจัด 100%, แดดรำไร)
     - **ความต้องการน้ำ:** (ปริมาณและจังหวะการรดน้ำ)

  3. 🛠️ **เทคนิคการปรับปรุงและบำรุงดิน:** (การปรับค่า pH และการเพิ่มสารอินทรีย์)`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    resultDiv.innerHTML = `<h3>ผลการวิเคราะห์เจาะลึก: ${soil}</h3><div>${reply.replace(/\n/g, '<br>')}</div>`;

  } catch (error) {
    resultDiv.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการเชื่อมต่อ AI โปรดตรวจสอบ API Key หรือลองใหม่อีกครั้ง</p>";
  }
}

// ================= ฟีเจอร์ที่ 2 (วิเคราะห์โอกาสรอด + สภาพอากาศจังหวัด) =================
async function analyzeFeature2() {
  const plant = document.getElementById('f2-plant').value;
  const soil = document.getElementById('f2-soil').value;
  const province = document.getElementById('f2-province').value;
  const resultDiv = document.getElementById('f2-result');

  if (!plant) {
    alert("กรุณาพิมพ์ชื่อพืชด้วยครับ");
    return;
  }

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = "<p class='loading'>🤖 กำลังวิเคราะห์สภาพอากาศ ประเมินดัชนี และคำนวณโอกาสรอด...</p>";

  const prompt = `ผู้ใช้ต้องการปลูกพืชชื่อ "${plant}" ในชนิดดิน "${soil}" ที่จังหวัด "${province}"
  ให้ช่วยวิเคราะห์ข้อมูลเป็นภาษาไทยอย่างละเอียดดังนี้:

  1. 🎯 **เปอร์เซ็นต์โอกาสรอด (%):** (ระบุตัวเลข % ชัดเจน)
  2. 🌤️ **การวิเคราะห์สภาพอากาศประจำจังหวัด "${province}":**
     - ลักษณะอุณหภูมิเฉลี่ยและช่วงความร้อน/หนาว
     - ปริมาณน้ำฝนสะสมและการกระจายตัวของฝน
     - ความชื้นสัมพัทธ์ในอากาศ
  3. 🧪 **ความเข้ากันได้ของพืช + ดิน + อากาศ:**
  4. 💡 **ข้อควรระวังและวิธีแก้ไข:** (เช่น โรคพืชจากความชื้น การปรับปรุงดิน หรือการให้น้ำเสริมช่วงแล้ง)`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    resultDiv.innerHTML = `<h3>ผลการวิเคราะห์โอกาสรอด: ${plant} (${province})</h3><div>${reply.replace(/\n/g, '<br>')}</div>`;

  } catch (error) {
    resultDiv.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการเชื่อมต่อ AI โปรดตรวจสอบ API Key หรือลองใหม่อีกครั้ง</p>";
  }
}

// ================= ฟีเจอร์ที่ 3 (แนะนำพืชตามภูมิอากาศ + ดิน) =================
async function analyzeFeature3() {
  const soil = document.getElementById('f3-soil').value;
  const province = document.getElementById('f3-province').value;
  const resultDiv = document.getElementById('f3-result');

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = "<p class='loading'>🤖 กำลังประมวลผลสภาพอากาศและดัชนีดินเพื่อค้นหาพืชที่เหมาะสม...</p>";

  const prompt = `ผู้ใช้มีดินชนิด "${soil}" อยู่ที่จังหวัด "${province}"
  ช่วยแนะนำพืชที่เหมาะสมที่สุด 3-5 ชนิด โดยอ้างอิงจาก:
  1. สภาพภูมิอากาศของจังหวัด "${province}" (ปริมาณน้ำฝน, อุณหภูมิ, ความชื้น)
  2. คุณสมบัติของดิน "${soil}"
  
  ระบุชื่อพืช เหตุผลประกอบ ข้อดี ความต้องการแสง และปริมาณน้ำที่ต้องรดสำหรับแต่ละพืช`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    resultDiv.innerHTML = `<h3>พืชที่แนะนำสำหรับ ${province} (${soil})</h3><div>${reply.replace(/\n/g, '<br>')}</div>`;

  } catch (error) {
    resultDiv.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการเชื่อมต่อ AI โปรดตรวจสอบ API Key หรือลองใหม่อีกครั้ง</p>";
  }
}

