from http.server import HTTPServer, SimpleHTTPRequestHandler
from io import BytesIO

import sys, json, boto3, base64, urllib

#import boto3

#s3 = boto3.resource('s3')
#for bucket in s3.buckets.all():
#	print(bucket.name)

#assumes invocation via "python3 app.py 80"
PORT = int(sys.argv[1])

defaultParams = {'width': ['320'], 'height': ['200'], 'ch1': ['255'], 'ch2': ['128'], 'ch3': ['128']}

def invokePNGFn(pd=defaultParams):
	pl = json.dumps(pd)  
	lmbd = boto3.client('lambda', region_name="us-west-1")                                                                           
	#synchronous invocation... eventually want async
	#but not sure how to handle that... SQS maybe?
	resp = lmbd.invoke(
		FunctionName="arn:aws:lambda:us-west-1:582819917992:function:createImage",
		Payload=pl)                                                                                     
	
	return resp['Payload'].read()
	
def checkInputRestrictions(pd):
	output = pd

	for field in ['ch1', 'ch2', 'ch3']:
		if ((pd[field] > 255) or (pd[field] < 0)): output = None
	if ((pd['width'] > 1920) or (pd['width'] < 0)): output = None
	if ((pd['height'] > 1080) or (pd['height'] < 0)): output = None
	
	return output

class PostRequestHandler(SimpleHTTPRequestHandler):
	
	def do_POST(self):
		#need content_length to know when to stop reading input!
		#once that's known, call out to lambda and either get the PNG
		#or the timeout error dict... or maybe other shit???
		content_length = int(self.headers['Content-Length'])
		body = self.rfile.read(content_length).decode(encoding="UTF-8")
		pd = urllib.parse.parse_qs(body)
		for field in pd:
			pd[field] = int(pd[field][0])
		
		response = BytesIO()	
		#enforce input restrictions!!
		if checkInputRestrictions(pd):		
			pngData = json.loads(invokePNGFn(pd)) 
			filenameStr = f"r{pd['ch1']}g{pd['ch2']}b{pd['ch3']}w{pd['width']}h{pd['height']}.png"	
			try:
				response.write(base64.b64decode(pngData['img']))
				self.send_response(200)
				self.send_header('Content-Type', 'image/png')
				self.send_header('Content-Disposition', f'attachment; filename="{filenameStr}"')
				self.end_headers()
				self.wfile.write(response.getvalue())

			except Exception as e:
				self.send_response(500)
				self.end_headers()
			
				response.write(b"An error occurred, probably a response timeout")
				self.wfile.write(response.getvalue())

		else:
			self.send_response(500)
			self.end_headers()
			response.write(b'Please ensure your inputs are within range (0-255 for color channel, 0-2000 for dimensions')
			self.wfile.write(response.getvalue())

with HTTPServer(("172.31.21.80", PORT), PostRequestHandler) as httpd:
	print(f"serving on port {PORT}")
	httpd.serve_forever()
