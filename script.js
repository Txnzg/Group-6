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

// ================= ฟีเจอร์ที่ 1 =================
function analyzeFeature1() {
  const soil = document.getElementById('f1-soil').value;
  const resultDiv = document.getElementById('f1-result');
  resultDiv.classList.remove('hidden');

  let data = {
    "ดินร่วน": "<b>พืชที่เหมาะสม:</b> ผักสวนครัว, มะเขือเทศ, มะม่วง, กล้วย<br><b>ข้อดี:</b> ระบายน้ำและอุ้มน้ำได้สมดุล ธาตุอาหารสูง<br><b>การดูแล:</b> ☀️ แดดจัด-กลางแจ้ง | 💧 รดน้ำวันละ 1-2 ครั้งพอชุ่ม",
    "ดินเหนียว": "<b>พืชที่เหมาะสม:</b> ข้าว, บัว, มะพร้าว<br><b>ข้อดี:</b> อุ้มน้ำได้ดีมาก เก็บธาตุอาหารได้แน่น<br><b>การดูแล:</b> ☀️ แดดจัด | 💧 รดน้ำเมื่อหน้าดินเริ่มแห้ง ระวังน้ำขังรากเน่า",
    "ดินทราย": "<b>พืชที่เหมาะสม:</b> มันสำปะหลัง, กระบองเพชร, มะพร้าว, สับปะรด<br><b>ข้อดี:</b> ระบายน้ำได้ไวมาก รากขยายตัวง่าย<br><b>การดูแล:</b> ☀️ แดดจัด | 💧 ต้องรดน้ำบ่อยขึ้น หรือใส่ปุ๋ยคอกเพิ่มการอุ้มน้ำ",
    "ดินร่วนปนทราย": "<b>พืชที่เหมาะสม:</b> ไม้ผลส่วนใหญ่, แตงโม, พริก, ข้าวโพด<br><b>ข้อดี:</b> ถ่ายเทอากาศดี รากเดินสะดวก<br><b>การดูแล:</b> ☀️ แดดจัด | 💧 รดน้ำสม่ำเสมอวันละ 1 ครั้ง",
    "ดินอินทรีย์/ดินพรุ": "<b>พืชที่เหมาะสม:</b> พืชผักใบเขียว, เฟิร์น, ไม้ประดับชอบความชื้น<br><b>ข้อดี:</b> อินทรียวัตถุสูงมาก ดินอุ้มน้ำได้ดี<br><b>การดูแล:</b> ⛅ แดดรำไรถึงแดดจัด | 💧 รักษาความชื้นให้คงที่"
  };

  resultDiv.innerHTML = `<h3>ผลการวิเคราะห์สำหรับ: ${soil}</h3><p>${data[soil]}</p>`;
}

// ================= ฟีเจอร์ที่ 2 (ใช้ Gemini AI) =================
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
  resultDiv.innerHTML = "<p class='loading'>🤖 กำลังวิเคราะห์ข้อมูลกับ AI รอสักครู่นะครับ...</p>";

  const prompt = `ผู้ใช้ต้องการปลูกพืชชื่อ "${plant}" ในชนิดดิน "${soil}" ที่จังหวัด "${province}"
  ให้ช่วยวิเคราะห์ข้อมูลเป็นภาษาไทยดังนี้:
  1. ประเมินโอกาสรอดเป็นเปอร์เซ็นต์ (%)
  2. เหตุผลวิเคราะห์ (ความเหมาะสมของดินและสภาพอากาศจังหวัดนั้น)
  3. คำแนะนำในการปรับปรุงดินและการดูแลหากต้องการปลูกจริง`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    resultDiv.innerHTML = `<h3>ผลการวิเคราะห์โอกาสรอด</h3><div>${reply.replace(/\n/g, '<br>')}</div>`;

  } catch (error) {
    resultDiv.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการเชื่อมต่อ AI โปรดตรวจสอบ API Key หรือลองใหม่อีกครั้ง</p>";
  }
}

// ================= ฟีเจอร์ที่ 3 (ใช้ Gemini AI) =================
async function analyzeFeature3() {
  const soil = document.getElementById('f3-soil').value;
  const province = document.getElementById('f3-province').value;
  const resultDiv = document.getElementById('f3-result');

  resultDiv.classList.remove('hidden');
  resultDiv.innerHTML = "<p class='loading'>🤖 กำลังค้นหาพืชที่เหมาะสมที่สุด...</p>";

  const prompt = `มีดินชนิด "${soil}" และต้องการปลูกในจังหวัด "${province}"
  ช่วยแนะนำพืชที่เหมาะสมที่สุด 3-5 ชนิด พร้อมระบุเหตุผลว่าทำไมถึงเหมาะกับสภาพดินและอากาศของจังหวัดนี้`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const reply = data.candidates[0].content.parts[0].text;
    resultDiv.innerHTML = `<h3>พืชที่แนะนำสำหรับ ${province} (${soil})</h3><div>${reply.replace(/\n/g, '<br>')}</div>`;

  } catch (error) {
    resultDiv.innerHTML = "<p style='color:red;'>เกิดข้อผิดพลาดในการเชื่อมต่อ AI โปรดตรวจสอบ API Key หรือลองใหม่อีกครั้ง</p>";
  }
}

