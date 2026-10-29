#!/usr/bin/env python3
"""Local-only serial bridge. Standard Python library; no packages needed (macOS/Linux)."""
import os, glob, json, time, threading, termios, select, argparse
from pathlib import Path
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
ROOT=Path(__file__).resolve().parent
state={"connected":False,"x":2048,"y":2048,"pot":2048,"button":0,"presses":0,"received":0,"port":"","error":"Connecting to ESP32..."}
lock=threading.Lock()
def reader(port):
 while True:
  fd=None
  try:
   ports=[port] if port else glob.glob('/dev/cu.wchusbserial*')+glob.glob('/dev/cu.usbserial*')+glob.glob('/dev/cu.usbmodem*')
   if not ports: raise OSError('No ESP32 USB port found. Plug in the board.')
   path=ports[0]; fd=os.open(path,os.O_RDWR|os.O_NOCTTY)
   a=termios.tcgetattr(fd); a[0]=0;a[1]=0;a[2]=termios.CS8|termios.CREAD|termios.CLOCAL;a[3]=0;a[4]=a[5]=termios.B115200;a[6][termios.VMIN]=0;a[6][termios.VTIME]=0
   termios.tcsetattr(fd,termios.TCSANOW,a)
   buf=b''; last=time.monotonic()
   while True:
    if select.select([fd],[],[],1)[0]:
     chunk=os.read(fd,4096)
     if not chunk: raise OSError('USB disconnected')
     buf+=chunk
     if len(buf)>16384: buf=buf[-4096:]
     while b'\n' in buf:
      line,buf=buf.split(b'\n',1)
      try:
       tag,x,y,pot,b,n=line.decode().strip().split(','); x,y,pot,b,n=map(int,(x,y,pot,b,n))
       if tag!='MNR' or not all(0<=v<=4095 for v in (x,y,pot)) or b not in (0,1) or n<0: continue
       with lock: state.update(connected=True,x=x,y=y,pot=pot,button=b,presses=n,received=time.time(),port=path,error='')
       last=time.monotonic()
      except (ValueError,UnicodeError): pass
    if time.monotonic()-last>3:
     with lock: state.update(connected=False,error='Waiting for game firmware. Close Arduino Serial Monitor.')
  except (OSError, termios.error) as e:
   with lock: state.update(connected=False,error=str(e))
   time.sleep(2)
  finally:
   if fd is not None:
    try: os.close(fd)
    except OSError: pass
class Handler(SimpleHTTPRequestHandler):
 def __init__(self,*a,**kw): super().__init__(*a,directory=str(ROOT/'web'),**kw)
 def do_GET(self):
  if self.path=='/api/state':
   with lock: data=json.dumps(state).encode()
   self.send_response(200); self.send_header('Content-Type','application/json');self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(data)
  else: super().do_GET()
 def log_message(self,*a): pass
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--port');parser.add_argument('--http',type=int,default=8765);args=parser.parse_args()
 threading.Thread(target=reader,args=(args.port,),daemon=True).start()
 print(f'Movie Night Roulette: http://127.0.0.1:{args.http}',flush=True)
 ThreadingHTTPServer(('127.0.0.1',args.http),Handler).serve_forever()
