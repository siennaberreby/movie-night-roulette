# Movie Night Roulette circuit

Open `Movie_Night_Roulette_Breadboard.fzz` in Fritzing to edit the circuit; its parts are bundled inside it. The PNG and SVG show the same part SVGs and positions as the native sketch. This version follows the supplied breadboard reference, adding a potentiometer at the top with red (3.3 V), black (GND), and orange (wiper to GPIO 13) jumper wires. Breadboard row numbers increase downward in this orientation. It matches `Movie_Night_Roulette_Documentation 2/firmware/MovieNightRoulette/MovieNightRoulette.ino`.

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

The TTGO board uses the downloaded `ESP32-TTGO-T-DISPLAY.fzpz` part, whose embedded author is Peter Van Epp (vanepp in the Fritzing forums), dated November 15, 2020. The board SVG is preserved; its ground and 3.3 V connectors have internal buses added to represent their shared electrical connections. The breadboard, potentiometer, pushbutton, resistor, and LED graphics are adapted from the Fritzing core library, with orientation and LED lead geometry normalized for this diagram. The five-pin joystick illustration and annotations were created for this documentation with ChatGPT assistance. No PCB footprint or circuit simulation is claimed.
