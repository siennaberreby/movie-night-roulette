# Movie Night Roulette 🎬

A movie picker that makes choosing what to watch feel like a game. Use a **joystick** to select a genre, turn a **potentiometer** to set the movie's intensity, and press a **button** to spin for a recommendation.

![Demo of Movie Night Roulette](media/demo.gif)

*Add a short GIF of the working controller and movie reveal at `media/demo.gif`.*

## Hardware

- LilyGO / TTGO ESP32 T-Display, USB data cable, breadboard, jumper wires
- Joystick module, potentiometer, pushbutton
- Optional LED and 220 Ω resistor (included in the code)

### Circuit

![Fritzing breadboard diagram](media/circuit-fritzing.png)

*Replace with a Fritzing diagram checked against the final physical circuit.*

| Component | ESP32 pin |
|---|---|
| Joystick VRx / VRy | GPIO 39 / GPIO 32 |
| Joystick switch | GPIO 33 |
| Potentiometer middle leg (wiper) | GPIO 13 |
| Pushbutton | GPIO 2 to GND |
| Optional LED | GPIO 15 through 220 Ω resistor |

Connect the joystick and potentiometer to **3.3 V** and **GND**, and share ground across the circuit. The button and joystick switch use internal pull-ups; their other switch terminals go to GND. Verify these assignments against your board and wiring.

## Run the project

1. Upload `firmware/MovieNightRoulette/MovieNightRoulette.ino` to the ESP32 T-Display in Arduino IDE (**115200 baud**).
2. Close Arduino Serial Monitor so the local Python server can read the same USB port.
3. From the project folder, run `python3 server.py` (or on macOS use `Start Movie Night.command`).
4. Open **http://127.0.0.1:8765** in your browser.
5. Move the joystick left/right for genre, turn the knob for intensity (1–5), and press the button to spin. If the joystick drifts, release it and click **Center joystick**.

If the server cannot find the board, provide its port: `python3 server.py --port /dev/cu.YOUR_PORT`. The serial bridge currently targets macOS/Linux, not Windows.

## Files

- `firmware/MovieNightRoulette/MovieNightRoulette.ino` — reads the three controls and sends serial data
- `server.py` — forwards serial readings to the browser at `/api/state`
- `web/game.js` — movie selection, controls, and roulette animation
- `web/index.html`, `web/style.css` — interface; `web/vendor/` — bundled p5.js

The game contains 75 curated films, filters by five genres and five intensity levels, and avoids repeating films during a session. Keyboard and mouse input are available for testing.

## Troubleshooting

If the controller shows offline, check the USB port and close Serial Monitor. If the genre changes without moving the joystick, use **Center joystick**. If the knob doesn't change intensity, check its wiper wire and look at the raw `Pot` reading in the interface.

**Project blog:** [add published blog link]  
**Demo video:** [add video link]
