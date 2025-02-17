// สร้างแผนที่
var map = L.map('map').setView([16.4322, 102.8236], 13); // พิกัดขอนแก่น

// เพิ่มแผนที่พื้นฐาน
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

 // ฟังก์ชันค้นหาตำแหน่งและเลื่อนแผนที่ไปยังผลลัพธ์
 document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault(); // ป้องกันการรีโหลดหน้า

    var searchText = document.getElementById('searchInput').value;

    if (searchText) {
        console.log("กำลังค้นหา: " + searchText);  // ตรวจสอบคำค้นหาที่ป้อนเข้ามา
        var geocoder = L.Control.Geocoder.nominatim(); // ใช้ geocoder สำหรับการค้นหา
        geocoder.geocode(searchText, function(results) {
            console.log("ผลลัพธ์การค้นหา: ", results);
            if (results.length > 0) {
                var latlng = results[0].center;
                map.flyTo(latlng, 13); // ซูมแผนที่ไปที่ผลลัพธ์การค้นหา
                if (window.searchMarker) {
                    map.removeLayer(window.searchMarker); // ลบ marker เก่าหากมี
                }
                window.searchMarker = L.marker(latlng).addTo(map) // เพิ่ม marker ใหม่ที่ตำแหน่ง
                    .bindPopup("สถานที่: " + results[0].name) // ข้อความใน popup
                    .openPopup(); // เปิด popup เมื่อเพิ่ม marker
            } else {
                alert("ไม่พบสถานที่ที่ค้นหา");
            }
        });
    }
});

// ฟังก์ชันเพื่อโหลดไฟล์ GeoJSON จาก URL
fetch("data/TBnmKK.geojson")
.then(response => response.json()) // แปลงข้อมูลที่ได้รับเป็น JSON
.then(data => {
    // เพิ่มข้อมูล GeoJSON ลงในแผนที่
    var TBnmKKLayer = L.geoJSON(data, {
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
        "ขอบเขตตำบล": TBnmKKLayer
    };

    // เพิ่ม Layer Control
    var layerControl = L.control.layers({"OpenStreetMap": osmLayer}, Layers).addTo(map); // เพิ่มแผงควบคุมเลเยอร์
})
.catch(error => console.log("Error loading GeoJSON:", error)); // จัดการข้อผิดพลาด