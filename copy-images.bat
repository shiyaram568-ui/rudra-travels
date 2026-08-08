@echo off
echo Copying generated images to assets folder...

set SRC=C:\Users\hello\.gemini\antigravity-ide\brain\4ef20ce2-8d68-4980-a217-631c783563f2
set DEST=c:\Users\hello\OneDrive\Desktop\baghel 29\assets\images

copy "%SRC%\hero_road_1784877219628.png" "%DEST%\hero-road.jpg"
copy "%SRC%\sedan_5seater_1784877230197.png" "%DEST%\sedan-5seater.jpg"
copy "%SRC%\suv_7seater_1784877240780.png" "%DEST%\suv-7seater.jpg"
copy "%SRC%\route_manali_1784877261047.png" "%DEST%\route-manali.jpg"
copy "%SRC%\route_jaipur_1784877273433.png" "%DEST%\route-jaipur.jpg"
copy "%SRC%\route_agra_1784877283382.png" "%DEST%\route-agra.jpg"
copy "%SRC%\route_rishikesh_1784877340229.png" "%DEST%\route-rishikesh.jpg"
copy "%SRC%\route_udaipur_1784877309334.png" "%DEST%\route-udaipur.jpg"
copy "%SRC%\route_shimla_1784877319594.png" "%DEST%\route-shimla.jpg"

echo Done! All images copied.
pause
