// สร้างแผนที่ใหม่ที่ใช้ id 'map' และตั้งพิกัดเริ่มต้นที่จังหวัดขอนแก่น (latitude: 16.4322, longitude: 102.8236) และระดับการซูมเป็น 15
var map = L.map('map').setView([16.4322, 102.8236], 13); // setView() ใช้ในการตั้งค่าพิกัดและระดับการซูมของแผนที่

// กำหนดแหล่งข้อมูลของแผนที่ (Tile Layer) ที่จะใช้แสดงแผนที่ จาก OpenStreetMap
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors' // การอ้างอิงแหล่งที่มาของแผนที่
}).addTo(map); // addTo(map) ใช้เพิ่มแผนที่ให้กับตัวแปร map

// ฟังก์ชันเพื่อโหลดไฟล์ GeoJSON จาก URL
fetch("data/ampnmKK.geojson")
.then(response => response.json()) // แปลงข้อมูลที่ได้รับเป็น JSON
.then(data => {
    // เพิ่มข้อมูล GeoJSON ลงในแผนที่
    var ampnmKKLayer = L.geoJSON(data, {
        style: { color: "blue" }, // กำหนดสีของเส้นขอบเขต
        onEachFeature: function(feature, layer) {
            // ตรวจสอบว่ามี properties ที่เรียกใช้งานอยู่จริง
            if (feature.properties.AMP_NAMT && feature.properties.AREA && feature.properties.PERIMETER) {
                // หากมีข้อมูลใน properties
                layer.bindTooltip(feature.properties.AMP_NAMT); // แสดงข้อมูล AMP_NAMT ใน tooltip
                layer.bindPopup(
                    "<b>อ.</b> " + feature.properties.AMP_NAMT + 
                    "<br><b>พื้นที่:</b> " + feature.properties.AREA + 
                    "<br><b>เส้นรอบวง:</b> " + feature.properties.PERIMETER
                ); // แสดงข้อมูลใน popup
            }
        }
    }).addTo(map); // เพิ่ม GeoJSON ลงในแผนที่

    // เพิ่ม Layer Control
    var Layers = {
        "ขอบเขตอำเภอ": ampnmKKLayer
    };

    // เพิ่ม Layer Control
    var layerControl = L.control.layers({"OpenStreetMap": osmLayer}, Layers).addTo(map); // เพิ่มแผงควบคุมเลเยอร์
})
.catch(error => console.log("Error loading GeoJSON:", error)); // จัดการข้อผิดพลาด

// เมื่อคลิกที่ 3 ขีด ให้แสดงหรือซ่อนเมนู
document.getElementById("menu-toggle").addEventListener("click", function() {
    const menu = document.getElementById("menu");
    menu.classList.toggle("visible"); // เพิ่มหรือลบคลาส visible
    menu.classList.toggle("hidden"); // ซ่อนหรือแสดงเมนู
});