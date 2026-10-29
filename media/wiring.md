# Movie Night Roulette circuit

The PNG was exported from Fritzing's Breadboard view. Open `Movie_Night_Roulette.fzz` in Fritzing to edit the circuit; the custom parts are bundled inside it. This is a labeled connection diagram, with component positions simplified for readability rather than a breadboard hole placement guide. It matches `Movie_Night_Roulette_Documentation 2/firmware/MovieNightRoulette/MovieNightRoulette.ino`.

| Component terminal | ESP32 connection |
| --- | --- |
| Joystick VRx | GPIO 39 |
| Joystick VRy | GPIO 32 |
| Joystick SW | GPIO 33 |
| Joystick supply / GND | 3.3 V / GND |
| Potentiometer outer terminals | 3.3 V and GND |
| Potentiometer center wiper | GPIO 13 |
| Normally open pushbutton | GPIO 2 and GND, opposite switched contacts |
| Indicator LED | GPIO 15 → series resistor → anode; cathode → GND |

GPIO 2 and GPIO 33 use the firmware's internal pull-ups. The controls share the ESP32 ground. USB supplies power and carries serial data at 115200 baud. The joystick's pin marked +5V on some modules is powered from **3.3 V** here so its analog outputs stay in the ESP32 input range. Potentiometer outer-terminal order determines which direction increases the reading.

The hardware photograph does not establish the LED resistor value. The diagram uses **220 Ω as a suggested value**, not a measured value. The potentiometer resistance is not specified by the firmware and is not inferred from the photograph.

## Part credits

The TTGO board uses the downloaded `ESP32-TTGO-T-DISPLAY.fzpz` part, whose embedded author is Peter Van Epp (vanepp in the Fritzing forums), dated November 15, 2020. Its original metadata and SVGs are preserved in the sketch. The labeled joystick, potentiometer, switch, LED/resistor assembly, buses, and annotation parts were created for this documentation with ChatGPT assistance. These simplified parts provide a wiring illustration; no PCB footprint or circuit simulation is claimed.
