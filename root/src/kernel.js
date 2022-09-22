const pathRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

class Kernel {
    routes = [() => ({
        path: '/404', config: () => (Promise.resolve({
            config: {
                mount: (app, cb) => {
                    document.querySelector("#root").innerHTML = "Page not found";
                    cb && cb()
                },
                unmount: (app, cb) => {

                    cb && cb()
                }
            }
        }))
    })]
    constructor(...apps) {
        this.routes = [...apps, ...this.routes]
        this.history = window.history
        this.loaction = window.location
        this.currentLocation;
        this.rootId = 'root'
        this.app;
        this.init()
    }

    redirect(url) {
        this.currentApp instanceof Function ? this.currentApp().then((app) => {
            app.config.unmount(this.app, () => {
                this.history.pushState({}, "", url)
                this.injectView()
            })

        }) : (() => {
            this.history.pushState({}, "", url)
            this.injectView()
        })()

    }
    getRoutes() {
        return this.routes
    }

    getCurrentApp() {
        return this.currentApp instanceof Function && this.currentApp()
    }

    async injectView() {
        const _matches = this.routes?.map((route, index) => ({
            id: index,
            route: route(),
            isMatch: !!this.loaction.pathname.match(pathRegex(route().path))
        }))
        let currentLocation = _matches?.find(match => match.isMatch)
        let _currentApp = currentLocation?.route?.config
        if (!currentLocation) {
            console.log(this.history.state)
            this.redirect('/')
        }

        if (_currentApp instanceof Function) {
            _currentApp().then((app) => {
                app.config.mount(this.rootId, (newApp) => {
                    this.app = newApp
                    this.currentLocation = currentLocation?.route?.path
                })
            })
            this.currentApp = _currentApp
        }
    }

    init() {
        window.addEventListener("popstate", () => {
            if (this.currentLocation === '/404') {
                this.history.go(0)
            }
            this.injectView()
        });

        document.body.addEventListener("click", e => {
            if (e.target.matches("[data-link]")) {
                e.preventDefault();
                this.redirect(e.target.href);
            }
        });

        this.injectView()
    }
}

export default Kernel

