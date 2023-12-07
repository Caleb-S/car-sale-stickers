var animationManager = (function () {
    var t = {},
        s = [],
        i = 0,
        a = 0,
        n = 0,
        o = !0,
        h = !1;
    function r(t) {
        for (var e = 0, r = t.target; e < a;)
            s[e].animation === r &&
                (s.splice(e, 1), (e -= 1), (a -= 1), r.isPaused || m()),
                (e += 1);
    }
    function l(t, e) {
        if (!t) return null;
        for (var r = 0; r < a;) {
            if (s[r].elem === t && null !== s[r].elem) return s[r].animation;
            r += 1;
        }
        var i = new AnimationItem();
        return f(i, t), i.setData(t, e), i;
    }
    function p() {
        (n += 1), d();
    }
    function m() {
        n -= 1;
    }
    function f(t, e) {
        t.addEventListener("destroy", r),
            t.addEventListener("_active", p),
            t.addEventListener("_idle", m),
            s.push({ elem: e, animation: t }),
            (a += 1);
    }
    function c(t) {
        var e,
            r = t - i;
        for (e = 0; e < a; e += 1) s[e].animation.advanceTime(r);
        (i = t), n && !h ? window.requestAnimationFrame(c) : (o = !0);
    }
    function e(t) {
        (i = t), window.requestAnimationFrame(c);
    }
    function d() {
        !h && n && o && (window.requestAnimationFrame(e), (o = !1));
    }
    return (
        (t.registerAnimation = l),
        (t.loadAnimation = function (t) {
            var e = new AnimationItem();
            return f(e, null), e.setParams(t), e;
        }),
        (t.setSpeed = function (t, e) {
            var r;
            for (r = 0; r < a; r += 1) s[r].animation.setSpeed(t, e);
        }),
        (t.setDirection = function (t, e) {
            var r;
            for (r = 0; r < a; r += 1) s[r].animation.setDirection(t, e);
        }),
        (t.play = function (t) {
            var e;
            for (e = 0; e < a; e += 1) s[e].animation.play(t);
        }),
        (t.pause = function (t) {
            var e;
            for (e = 0; e < a; e += 1) s[e].animation.pause(t);
        }),
        (t.stop = function (t) {
            var e;
            for (e = 0; e < a; e += 1) s[e].animation.stop(t);
        }),
        (t.togglePause = function (t) {
            var e;
            for (e = 0; e < a; e += 1) s[e].animation.togglePause(t);
        }),
        (t.searchAnimations = function (t, e, r) {
            var i,
                s = [].concat(
                    [].slice.call(document.getElementsByClassName("lottie")),
                    [].slice.call(document.getElementsByClassName("bodymovin"))
                ),
                a = s.length;
            for (i = 0; i < a; i += 1)
                r && s[i].setAttribute("data-bm-type", r), l(s[i], t);
            if (e && 0 === a) {
                r || (r = "svg");
                var n = document.getElementsByTagName("body")[0];
                n.innerText = "";
                var o = createTag("div");
                (o.style.width = "100%"),
                    (o.style.height = "100%"),
                    o.setAttribute("data-bm-type", r),
                    n.appendChild(o),
                    l(o, t);
            }
        }),
        (t.resize = function () {
            var t;
            for (t = 0; t < a; t += 1) s[t].animation.resize();
        }),
        (t.goToAndStop = function (t, e, r) {
            var i;
            for (i = 0; i < a; i += 1) s[i].animation.goToAndStop(t, e, r);
        }),
        (t.destroy = function (t) {
            var e;
            for (e = a - 1; 0 <= e; e -= 1) s[e].animation.destroy(t);
        }),
        (t.freeze = function () {
            h = !0;
        }),
        (t.unfreeze = function () {
            (h = !1), d();
        }),
        (t.setVolume = function (t, e) {
            var r;
            for (r = 0; r < a; r += 1) s[r].animation.setVolume(t, e);
        }),
        (t.mute = function (t) {
            var e;
            for (e = 0; e < a; e += 1) s[e].animation.mute(t);
        }),
        (t.unmute = function (t) {
            var e;
            for (e = 0; e < a; e += 1) s[e].animation.unmute(t);
        }),
        (t.getRegisteredAnimations = function () {
            var t,
                e = s.length,
                r = [];
            for (t = 0; t < e; t += 1) r.push(s[t].animation);
            return r;
        }),
        t
    );
})(), AnimationItem = function () {
    (this._cbs = []),
        (this.name = ""),
        (this.path = ""),
        (this.isLoaded = !1),
        (this.currentFrame = 0),
        (this.currentRawFrame = 0),
        (this.firstFrame = 0),
        (this.totalFrames = 0),
        (this.frameRate = 0),
        (this.frameMult = 0),
        (this.playSpeed = 1),
        (this.playDirection = 1),
        (this.playCount = 0),
        (this.animationData = {}),
        (this.assets = []),
        (this.isPaused = !0),
        (this.autoplay = !1),
        (this.loop = !0),
        (this.renderer = null),
        (this.animationID = createElementID()),
        (this.assetsPath = ""),
        (this.timeCompleted = 0),
        (this.segmentPos = 0),
        (this.isSubframeEnabled = subframeEnabled),
        (this.segments = []),
        (this._idle = !0),
        (this._completedLoop = !1),
        (this.projectInterface = ProjectInterface()),
        (this.imagePreloader = new ImagePreloader()),
        (this.audioController = audioControllerFactory());
};

function loadAnimation(t) {
    return (
        !0 === standalone && (t.animationData = JSON.parse(animationData)),
        animationManager.loadAnimation(t)
    );
}