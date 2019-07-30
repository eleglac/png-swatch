# PNG-Swatch - An AWS Test App

### Overview
This web app is designed to provide the user with a PNG containing three properties:
- A width
- A height
- A fill with a specific RGB color

This app is currently live at:
http://ec2-13-57-185-214.us-west-1.compute.amazonaws.com/

### AWS Services Used
- EC2 (web server)
- Lambda (image generation)

### TODO
- Domain name
- Integrate S3 (PNG storage) and SQS (event-based operation, async image gen & transfer... I think)
- UI
- Mobile support (current mobile support is pretty awful)

### Sources of Inspiration and Assistance
Figuring out how to support POST with python3 http.server:
- https://blog.anvileight.com/posts/simple-python-http-server

Transferring image data from Lambda to EC2:
- https://docs.python.org/3/library/json.html
- https://docs.python.org/3.7/library/base64.html
- https://docs.python.org/3/library/io.html

AWS library for Python3:
- https://boto3.amazonaws.com/v1/documentation/api/latest/guide/quickstart.html

HTML Form handling:
- http://pwp.stevecassidy.net/bottle/forms-processing.html

HTTP Status Code Reference:
- https://www.restapitutorial.com/httpstatuscodes.html

PNG Image Generation in Python:
- https://pillow.readthedocs.io/en/stable/handbook/overview.html

