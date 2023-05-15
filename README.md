# cesium

Video player web application.

## development

Pull requests are welcome.

This application depends heavily on a library called `errokees` which handles keyboard navigation, which is needed to make the TV remote function https://github.com/btimby/errokees/.

If you need to modify how the keyboard handling is done, look there.

To develop on Cesium itself, you can run the code locally.

### running locally

This application can be run like most javascript / vue applications using the webpack development server. Just use the provided `Makefile` target to launch it.

```bash
$ make dev
```

Then visit http://localhost:8080/ in your browser of choice. In case port 8080 is in use, the development server will increment the port number. Check the console output to determine the port to use.
