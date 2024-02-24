(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        (function() {
          var lastTime = 0;
          var vendors = ["ms", "moz", "webkit", "o"];
          for (var x = 0; x < vendors.length && !window2.requestAnimationFrame; ++x) {
            window2.requestAnimationFrame = window2[vendors[x] + "RequestAnimationFrame"];
            window2.cancelAnimationFrame = window2[vendors[x] + "CancelAnimationFrame"] || window2[vendors[x] + "CancelRequestAnimationFrame"];
          }
          if (!window2.requestAnimationFrame)
            window2.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window2.setTimeout(function() {
                callback(currTime + timeToCall);
              }, timeToCall);
              lastTime = currTime + timeToCall;
              return id;
            };
          if (!window2.cancelAnimationFrame)
            window2.cancelAnimationFrame = function(id) {
              clearTimeout(id);
            };
        })();
        var canvas, progressTimerId, fadeTimerId, currentProgress, showing, addEvent = function(elem, type, handler) {
          if (elem.addEventListener)
            elem.addEventListener(type, handler, false);
          else if (elem.attachEvent)
            elem.attachEvent("on" + type, handler);
          else
            elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(Math.ceil(currentProgress * canvas.width), options.barThickness / 2);
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className)
            canvas.classList.add(options.className);
          document2.body.appendChild(canvas);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key))
                options[key] = opts[key];
          },
          show: function() {
            if (showing)
              return;
            showing = true;
            if (fadeTimerId !== null)
              window2.cancelAnimationFrame(fadeTimerId);
            if (!canvas)
              createCanvas();
            canvas.style.opacity = 1;
            canvas.style.display = "block";
            topbar2.progress(0);
            if (options.autoRun) {
              (function loop() {
                progressTimerId = window2.requestAnimationFrame(loop);
                topbar2.progress("+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2));
              })();
            }
          },
          progress: function(to) {
            if (typeof to === "undefined")
              return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            if (!showing)
              return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // ../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function")
        return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target)
        form.target = target;
      else if (targetModifierKey)
        form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e) {
      var element = e.target;
      if (e.defaultPrevented)
        return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method")) {
          handleClick(element, e.metaKey || e.shiftKey);
          e.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e) {
      var message = e.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e.preventDefault();
      }
    }, false);
  })();

  // ../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || global;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    matchReceive({ status, response, _ref }) {
      this.recHooks.filter((h2) => h2.status === status).forEach((h2) => h2.callback(response));
    }
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(this.socket.onOpen(() => {
        this.rejoinTimer.reset();
        if (this.isErrored()) {
          this.rejoin();
        }
      }));
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger())
          this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger())
          this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    onMessage(_event, payload, _ref) {
      return payload;
    }
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger())
          this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    joinRef() {
      return this.joinPush.ref;
    }
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i = 0; i < eventBindings.length; i++) {
        let bind = eventBindings[i];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, accept, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback);
      }
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, accept, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      req.setRequestHeader("Content-Type", accept);
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch (e) {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var LongPoll = class {
    constructor(endPoint) {
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      this.poll();
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      this.ajax("GET", null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    send(body) {
      this.ajax("POST", body, () => this.onerror("timeout"), (resp) => {
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), "application/json", body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
    }
    getLongPollTransport() {
      return LongPoll;
    }
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.sendBuffer = [];
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    endPointURL() {
      let uri = Ajax.appendParams(Ajax.appendParams(this.endPoint, this.params()), { vsn: this.vsn });
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.closeWasClean = true;
      this.reconnectTimer.reset();
      this.teardown(callback, code, reason);
    }
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn) {
        return;
      }
      this.connectClock++;
      this.closeWasClean = false;
      this.conn = new this.transport(this.endPointURL());
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    log(kind, msg, data) {
      this.logger(kind, msg, data);
    }
    hasLogger() {
      return this.logger !== null;
    }
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger())
        this.log("transport", `connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      this.waitForBufferDone(() => {
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      let closeCode = event && event.code;
      if (this.hasLogger())
        this.log("transport", "close", event);
      this.triggerChanError();
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    onConnError(error) {
      if (this.hasLogger())
        this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    isConnected() {
      return this.connectionState() === "open";
    }
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c) => c.joinRef() !== channel.joinRef());
    }
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger())
          this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i = 0; i < this.channels.length; i++) {
          const channel = this.channels[i];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i = 0; i < this.stateChangeCallbacks.message.length; i++) {
          let [, callback] = this.stateChangeCallbacks.message[i];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c) => c.topic === topic && (c.isJoined() || c.isJoining()));
      if (dupChannel) {
        if (this.hasLogger())
          this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading"
  ];
  var PHX_COMPONENT = "data-phx-component";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF = "data-phx-ref";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_PAGE_LOADING = "page-loading";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_DISCONNECTED_CLASS = "phx-loading";
  var PHX_NO_FEEDBACK_CLASS = "phx-no-feedback";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_FEEDBACK_FOR = "feedback-for";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = ["text", "textarea", "number", "email", "password", "search", "tel", "url", "date", "time", "datetime-local", "color", "range"];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_PROGRESS = "progress";
  var LOADER_TIMEOUT = 1;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var DYNAMICS = "d";
  var STATIC = "s";
  var COMPONENTS = "c";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var EntryUploader = class {
    constructor(entry, chunkSize, liveSocket2) {
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunkSize;
      this.chunkTimer = null;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, { token: entry.metadata() });
    }
    error(reason) {
      clearTimeout(this.chunkTimer);
      this.uploadChannel.leave();
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      let reader = new window.FileReader();
      let blob = this.entry.file.slice(this.offset, this.chunkSize + this.offset);
      reader.onload = (e) => {
        if (e.target.error === null) {
          this.offset += e.target.result.byteLength;
          this.pushChunk(e.target.result);
        } else {
          return logError("Read error: " + e.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(() => this.readNextChunk(), this.liveSocket.getLatencySim() || 0);
        }
      });
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    let type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    let ids = /* @__PURE__ */ new Set();
    let elems = document.querySelectorAll("*[id]");
    for (let i = 0, len = elems.length; i < len; i++) {
      if (ids.has(elems[i].id)) {
        console.error(`Multiple IDs detected: ${elems[i].id}. Ensure unique element ids.`);
      } else {
        ids.add(elems[i].id);
      }
    }
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (let x in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      let entryUploader = new EntryUploader(entry, resp.config.chunk_size, liveSocket2);
      entryUploader.upload();
    });
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage, namespace, subkey) {
      return localStorage.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage, namespace, subkey, initial, func) {
      let current = this.getLocal(localStorage, namespace, subkey);
      let key = this.localKey(namespace, subkey);
      let newVal = current === null ? initial : func(current);
      localStorage.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage, namespace, subkey) {
      return JSON.parse(localStorage.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(callback(history.state || {}), "", window.location.href);
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            let currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          let hashEl = this.getHashTargetEl(window.location.hash);
          if (hashEl) {
            hashEl.scrollIntoView();
          } else if (meta.type === "redirect") {
            window.scroll(0, 0);
          }
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value) {
      document.cookie = `${name}=${value}`;
    },
    getCookie(name) {
      return document.cookie.replace(new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`), "$1");
    },
    redirect(toURL, flash) {
      if (flash) {
        Browser.setCookie("__phoenix_flash__", flash + "; max-age=60000; path=/");
      }
      window.location = toURL;
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      let hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      let array = Array.from(node.querySelectorAll(query));
      return callback ? array.forEach(callback) : array;
    },
    childNodeLength(html) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    findUploadInputs(node) {
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`);
    },
    findComponentNodeList(node, cid) {
      return this.filterWithinSameLiveView(this.all(node, `[${PHX_COMPONENT}="${cid}"]`), node);
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      let template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findParentCIDs(node, cids) {
      let initial = new Set(cids);
      return cids.reduce((acc, cid) => {
        let selector = `[${PHX_COMPONENT}="${cid}"] [${PHX_COMPONENT}]`;
        this.filterWithinSameLiveView(this.all(node, selector), node).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => acc.delete(childCID));
        return acc;
      }, initial);
    },
    filterWithinSameLiveView(nodes, parent) {
      if (parent.querySelector(PHX_VIEW_SELECTOR)) {
        return nodes.filter((el) => this.withinSameLiveView(el, parent));
      } else {
        return nodes;
      }
    },
    withinSameLiveView(node, parent) {
      while (node = node.parentNode) {
        if (node.isSameNode(parent)) {
          return true;
        }
        if (node.getAttribute(PHX_SESSION) !== null) {
          return false;
        }
      }
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      let existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      let titleEl = document.querySelector("title");
      let { prefix, suffix } = titleEl.dataset;
      document.title = `${prefix || ""}${str}${suffix || ""}`;
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce === "") {
        debounce = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      let value = debounce || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          if (this.once(el, "debounce-blur")) {
            el.addEventListener("blur", () => callback());
          }
          return;
        default:
          let timeout = parseInt(value);
          let trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          let currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              let prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              this.putPrivate(el, THROTTLED, true);
              setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          let form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                let input = form.querySelector(`[name="${name}"]`);
                this.incCycle(input, DEBOUNCE_TRIGGER);
                this.deletePrivate(input, THROTTLED);
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => this.triggerCycle(el, DEBOUNCE_TRIGGER));
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      let [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    discardError(container, el, phxFeedbackFor) {
      let field = el.getAttribute && el.getAttribute(phxFeedbackFor);
      let input = field && container.querySelector(`[id="${field}"], [name="${field}"]`);
      if (!input) {
        return;
      }
      if (!(this.private(input, PHX_HAS_FOCUSED) || this.private(input.form, PHX_HAS_SUBMITTED))) {
        el.classList.add(PHX_NO_FEEDBACK_CLASS);
      }
    },
    showError(inputEl, phxFeedbackFor) {
      if (inputEl.id || inputEl.name) {
        this.all(inputEl.form, `[${phxFeedbackFor}="${inputEl.id}"], [${phxFeedbackFor}="${inputEl.name}"]`, (el) => {
          this.removeClass(el, PHX_NO_FEEDBACK_CLASS);
        });
      }
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    dispatchEvent(target, name, opts = {}) {
      let bubbles = opts.bubbles === void 0 ? true : !!opts.bubbles;
      let eventOpts = { bubbles, cancelable: true, detail: opts.detail || {} };
      let event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        let cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    mergeAttrs(target, source, opts = {}) {
      let exclude = opts.exclude || [];
      let isIgnored = opts.isIgnored;
      let sourceAttrs = source.attributes;
      for (let i = sourceAttrs.length - 1; i >= 0; i--) {
        let name = sourceAttrs[i].name;
        if (exclude.indexOf(name) < 0) {
          target.setAttribute(name, source.getAttribute(name));
        }
      }
      let targetAttrs = target.attributes;
      for (let i = targetAttrs.length - 1; i >= 0; i--) {
        let name = targetAttrs[i].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      let wasFocused = focused.matches(":focus");
      if (focused.readOnly) {
        focused.blur();
      }
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null;
    },
    syncPendingRef(fromEl, toEl, disableWith) {
      let ref = fromEl.getAttribute(PHX_REF);
      if (ref === null) {
        return true;
      }
      let refSrc = fromEl.getAttribute(PHX_REF_SRC);
      if (DOM.isFormInput(fromEl) || fromEl.getAttribute(disableWith) !== null) {
        if (DOM.isUploadInput(fromEl)) {
          DOM.mergeAttrs(fromEl, toEl, { isIgnored: true });
        }
        DOM.putPrivate(fromEl, PHX_REF, toEl);
        return false;
      } else {
        PHX_EVENT_CLASSES.forEach((className) => {
          fromEl.classList.contains(className) && toEl.classList.add(className);
        });
        toEl.setAttribute(PHX_REF, ref);
        toEl.setAttribute(PHX_REF_SRC, refSrc);
        return true;
      }
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend"])) {
        let toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            let isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode) {
              logError(`only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`);
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      let retainedAttrs = /* @__PURE__ */ new Set(["id", PHX_SESSION, PHX_STATIC, PHX_MAIN, PHX_ROOT_ID]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        let newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach((attr) => newContainer.setAttribute(attr, attrs[attr]));
        retainedAttrs.forEach((attr) => newContainer.setAttribute(attr, container.getAttribute(attr)));
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      let op = (DOM.private(el, "sticky") || []).find(([existingName]) => name === existingName);
      if (op) {
        let [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _2]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      let stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        let existingIndex = ops.findIndex(([existingName]) => name === existingName);
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      let ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      let isNew = file._phxRef === void 0;
      let activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      let isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      let preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      let isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    constructor(fileEl, file, view) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    cancel() {
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      LiveUploader.clearFiles(this.fileEl);
    }
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      let activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        let callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, { input: this.fileEl, response: resp });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class {
    static genFileRef(file) {
      let ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      let file = this.activeFiles(inputEl).find((file2) => this.genFileRef(file2) === ref);
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      let files = this.activeFiles(inputEl);
      let fileData = {};
      files.forEach((file) => {
        let entry = { path: inputEl.name };
        let uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.name = file.name || entry.ref;
        entry.type = file.type;
        entry.size = file.size;
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(inputEl, "files", dom_default.private(inputEl, "files").filter((f) => !Object.is(f, file)));
    }
    static trackFiles(inputEl, files) {
      if (inputEl.getAttribute("multiple") !== null) {
        let newFiles = files.filter((file) => !this.activeFiles(inputEl).find((f) => Object.is(f, file)));
        dom_default.putPrivate(inputEl, "files", this.activeFiles(inputEl).concat(newFiles));
        inputEl.value = null;
      } else {
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((el) => el.files && this.activeFiles(el).length > 0);
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter((f) => UploadEntry.isActive(input, f));
    }
    static inputsAwaitingPreflight(formEl) {
      let fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter((input) => this.filesAwaitingPreflight(input).length > 0);
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter((f) => !UploadEntry.isPreflighted(input, f));
    }
    constructor(inputEl, view, onComplete) {
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(LiveUploader.filesAwaitingPreflight(inputEl) || []).map((file) => new UploadEntry(inputEl, file, view));
      this.numEntriesInProgress = this._entries.length;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        entry.zipPostFlight(resp);
        entry.onDone(() => {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        });
        return entry;
      });
      let groupedEntries = this._entries.reduce((acc, entry) => {
        let { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (let name in groupedEntries) {
        let { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        let newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view.cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(this.el.getAttribute(PHX_UPLOAD_REF));
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    }
  };
  var hooks_default = Hooks;
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      let idsBefore = /* @__PURE__ */ new Set();
      let idsAfter = new Set([...containerAfter.children].map((child) => child.id));
      let elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            let previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({ elementId: child.id, previousElementId });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    perform() {
      let container = dom_default.byId(this.containerId);
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(document.getElementById(elementToModify.previousElementId), (previousElem) => {
            maybe(document.getElementById(elementToModify.elementId), (elem) => {
              let isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
              if (!isInRightPlace) {
                previousElem.insertAdjacentElement("afterend", elem);
              }
            });
          });
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            let isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(document.getElementById(elemId), (elem) => container.insertAdjacentElement("afterbegin", elem));
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i = toNodeAttrs.length - 1; i >= 0; i--) {
      attr = toNodeAttrs[i];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d = fromNodeAttrs.length - 1; d >= 0; d--) {
      attr = fromNodeAttrs[d];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i;
                break;
              }
              i++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML" || fromNode.nodeName === "BODY") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else {
          toNode = toElement(toNode);
        }
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(curFromNodeChild, fromEl, true);
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          if (onBeforeElUpdated(fromEl, toEl) === false) {
            return;
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(curFromNodeChild, fromEl, true);
                          }
                          curFromNodeChild = matchingFromEl;
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(curFromNodeChild, fromEl, true);
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              fromEl.appendChild(matchingFromEl);
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                fromEl.appendChild(curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i = 0, len = keyedRemovalList.length; i < len; i++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    static patchEl(fromEl, toEl, activeElement) {
      morphdom_esm_default(fromEl, toEl, {
        childrenOnly: false,
        onBeforeElUpdated: (fromEl2, toEl2) => {
          if (activeElement && activeElement.isSameNode(fromEl2) && dom_default.isFormInput(fromEl2)) {
            dom_default.mergeFocusedInput(fromEl2, toEl2);
            return false;
          }
        }
      });
    }
    constructor(view, container, id, html, targetCID) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      dom_default.all(this.container, "[phx-update=append] > *, [phx-update=prepend] > *", (el) => {
        el.setAttribute(PHX_PRUNE, "");
      });
    }
    perform() {
      let { view, liveSocket: liveSocket2, container, html } = this;
      let targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      if (this.isCIDPatch() && !targetContainer) {
        return;
      }
      let focused = liveSocket2.getActiveElement();
      let { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      let phxUpdate = liveSocket2.binding(PHX_UPDATE);
      let phxFeedbackFor = liveSocket2.binding(PHX_FEEDBACK_FOR);
      let disableWith = liveSocket2.binding(PHX_DISABLE_WITH);
      let phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      let phxRemove = liveSocket2.binding("remove");
      let added = [];
      let updates = [];
      let appendPrependUpdates = [];
      let pendingRemoves = [];
      let externalFormTriggered = null;
      let diffHTML = liveSocket2.time("premorph container prep", () => {
        return this.buildDiffHTML(container, html, phxUpdate, targetContainer);
      });
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        morphdom_esm_default(targetContainer, diffHTML, {
          childrenOnly: targetContainer.getAttribute(PHX_COMPONENT) === null,
          getNodeKey: (node) => {
            return dom_default.isPhxDestroyed(node) ? null : node.id;
          },
          onBeforeNodeAdded: (el) => {
            this.trackBefore("added", el);
            return el;
          },
          onNodeAdded: (el) => {
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            dom_default.discardError(targetContainer, el, phxFeedbackFor);
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => {
            if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
              liveSocket2.destroyViewByEl(el);
            }
            this.trackAfter("discarded", el);
          },
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentNode !== null && dom_default.isPhxUpdate(el.parentNode, phxUpdate, ["append", "prepend"]) && el.id) {
              return false;
            }
            if (el.getAttribute && el.getAttribute(phxRemove)) {
              pendingRemoves.push(el);
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, { isIgnored: true });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && (fromEl.validity && fromEl.validity.badInput)) {
              return false;
            }
            if (!dom_default.syncPendingRef(fromEl, toEl, disableWith)) {
              if (dom_default.isUploadInput(fromEl)) {
                this.trackBefore("updated", fromEl, toEl);
                updates.push(fromEl);
              }
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (dom_default.isPhxChild(toEl)) {
              let prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            dom_default.copyPrivates(toEl, fromEl);
            dom_default.discardError(targetContainer, toEl, phxFeedbackFor);
            let isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            if (isFocusedFormEl) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(new DOMPostMorphRestorer(fromEl, toEl, toEl.getAttribute(phxUpdate)));
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return true;
            }
          }
        });
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(() => dom_default.restoreFocus(focused, selectionStart, selectionEnd));
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves);
        liveSocket2.requestDOMUpdate(() => {
          pendingRemoves.forEach((el) => {
            let child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
      if (externalFormTriggered) {
        liveSocket2.disconnect();
        externalFormTriggered.submit();
      }
      return true;
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.getAttribute(PHX_SKIP) !== null;
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      let [first, ...rest] = dom_default.findComponentNodeList(this.container, this.targetCID);
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    buildDiffHTML(container, html, phxUpdate, targetContainer) {
      let isCIDPatch = this.isCIDPatch();
      let isCIDWithSingleRoot = isCIDPatch && targetContainer.getAttribute(PHX_COMPONENT) === this.targetCID.toString();
      if (!isCIDPatch || isCIDWithSingleRoot) {
        return html;
      } else {
        let diffContainer = null;
        let template = document.createElement("template");
        diffContainer = dom_default.cloneNode(targetContainer);
        let [firstComponent, ...rest] = dom_default.findComponentNodeList(diffContainer, this.targetCID);
        template.innerHTML = html;
        rest.forEach((el) => el.remove());
        Array.from(diffContainer.childNodes).forEach((child) => {
          if (child.id && child.nodeType === Node.ELEMENT_NODE && child.getAttribute(PHX_COMPONENT) !== this.targetCID.toString()) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
        });
        Array.from(template.content.childNodes).forEach((el) => diffContainer.insertBefore(el, firstComponent));
        firstComponent.remove();
        return diffContainer.outerHTML;
      }
    }
  };
  var Rendered = class {
    static extract(diff) {
      let { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      return this.recursiveToString(this.rendered, this.rendered[COMPONENTS], onlyCids);
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      let output = { buffer: "", components, onlyCids };
      this.toOutputBuffer(rendered, null, output);
      return output.buffer;
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i) => parseInt(i));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    mergeDiff(diff) {
      let newc = diff[COMPONENTS];
      let cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        let oldc = this.rendered[COMPONENTS];
        for (let cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (let cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 ? cdiff : this.cloneMerge(oldc[cid] || {}, cdiff);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      for (let key in source) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          this.doMutableMerge(targetVal, val);
        } else {
          target[key] = val;
        }
      }
    }
    cloneMerge(target, source) {
      let merged = __spreadValues(__spreadValues({}, target), source);
      for (let key in merged) {
        let val = source[key];
        let targetVal = target[key];
        if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
          merged[key] = this.cloneMerge(targetVal, val);
        }
      }
      return merged;
    }
    componentToString(cid) {
      return this.recursiveCIDToString(this.rendered[COMPONENTS], cid);
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    toOutputBuffer(rendered, templates, output) {
      if (rendered[DYNAMICS]) {
        return this.comprehensionToBuffer(rendered, templates, output);
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      output.buffer += statics[0];
      for (let i = 1; i < statics.length; i++) {
        this.dynamicToBuffer(rendered[i - 1], templates, output);
        output.buffer += statics[i];
      }
    }
    comprehensionToBuffer(rendered, templates, output) {
      let { [DYNAMICS]: dynamics, [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      let compTemplates = templates || rendered[TEMPLATES];
      for (let d = 0; d < dynamics.length; d++) {
        let dynamic = dynamics[d];
        output.buffer += statics[0];
        for (let i = 1; i < statics.length; i++) {
          this.dynamicToBuffer(dynamic[i - 1], compTemplates, output);
          output.buffer += statics[i];
        }
      }
    }
    dynamicToBuffer(rendered, templates, output) {
      if (typeof rendered === "number") {
        output.buffer += this.recursiveCIDToString(output.components, rendered, output.onlyCids);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output);
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      let component = components[cid] || logError(`no component for CID ${cid}`, components);
      let template = document.createElement("template");
      template.innerHTML = this.recursiveToString(component, components, onlyCids);
      let container = template.content;
      let skip = onlyCids && !onlyCids.has(cid);
      let [hasChildNodes, hasChildComponents] = Array.from(container.childNodes).reduce(([hasNodes, hasComponents], child, i) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          if (child.getAttribute(PHX_COMPONENT)) {
            return [hasNodes, true];
          }
          child.setAttribute(PHX_COMPONENT, cid);
          if (!child.id) {
            child.id = `${this.parentViewId()}-${cid}-${i}`;
          }
          if (skip) {
            child.setAttribute(PHX_SKIP, "");
            child.innerHTML = "";
          }
          return [true, hasComponents];
        } else {
          if (child.nodeValue.trim() !== "") {
            logError(`only HTML element tags are allowed at the root of components.

got: "${child.nodeValue.trim()}"

within:
`, template.innerHTML.trim());
            child.replaceWith(this.createSpan(child.nodeValue, cid));
            return [true, hasComponents];
          } else {
            child.remove();
            return [hasNodes, hasComponents];
          }
        }
      }, [false, false]);
      if (!hasChildNodes && !hasChildComponents) {
        logError("expected at least one HTML element tag inside a component, but the component is empty:\n", template.innerHTML.trim());
        return this.createSpan("", cid).outerHTML;
      } else if (!hasChildNodes && hasChildComponents) {
        logError("expected at least one HTML element tag directly inside a component, but only subcomponents were found. A component must render at least one HTML tag directly inside itself.", template.innerHTML.trim());
        return template.innerHTML;
      } else {
        return template.innerHTML;
      }
    }
    createSpan(text, cid) {
      let span = document.createElement("span");
      span.innerText = text;
      span.setAttribute(PHX_COMPONENT, cid);
      return span;
    }
  };
  var viewHookID = 1;
  var ViewHook = class {
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return el.phxHookId;
    }
    constructor(view, el, callbacks) {
      this.__view = view;
      this.liveSocket = view.liveSocket;
      this.__callbacks = callbacks;
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      this.el = el;
      this.el.phxHookId = this.constructor.makeID();
      for (let key in this.__callbacks) {
        this[key] = this.__callbacks[key];
      }
    }
    __mounted() {
      this.mounted && this.mounted();
    }
    __updated() {
      this.updated && this.updated();
    }
    __beforeUpdate() {
      this.beforeUpdate && this.beforeUpdate();
    }
    __destroyed() {
      this.destroyed && this.destroyed();
    }
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected && this.reconnected();
      }
    }
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected && this.disconnected();
    }
    pushEvent(event, payload = {}, onReply = function() {
    }) {
      return this.__view.pushHookEvent(null, event, payload, onReply);
    }
    pushEventTo(phxTarget, event, payload = {}, onReply = function() {
    }) {
      return this.__view.withinTargets(phxTarget, (view, targetCtx) => {
        return view.pushHookEvent(targetCtx, event, payload, onReply);
      });
    }
    handleEvent(event, callback) {
      let callbackRef = (customEvent, bypass) => bypass ? event : callback(customEvent.detail);
      window.addEventListener(`phx:${event}`, callbackRef);
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(callbackRef) {
      let event = callbackRef(null, true);
      window.removeEventListener(`phx:${event}`, callbackRef);
      this.__listeners.delete(callbackRef);
    }
    upload(name, files) {
      return this.__view.dispatchUploads(name, files);
    }
    uploadTo(phxTarget, name, files) {
      return this.__view.withinTargets(phxTarget, (view) => view.dispatchUploads(name, files));
    }
    __cleanup__() {
      this.__listeners.forEach((callbackRef) => this.removeHandleEvent(callbackRef));
    }
  };
  var JS = {
    exec(eventType, phxEvent, view, sourceEl, defaults) {
      let [defaultKind, defaultArgs] = defaults || [null, {}];
      let commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind && defaultArgs.data) {
          args.data = Object.assign(args.data || {}, defaultArgs.data);
        }
        this.filterToEls(sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    exec_dispatch(eventType, phxEvent, view, sourceEl, el, { to, event, detail, bubbles }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(eventType, phxEvent, view, sourceEl, el, args) {
      if (!view.isConnected()) {
        return;
      }
      let { event, data, target, page_loading, loading, value, dispatcher } = args;
      let pushOpts = { loading, value, target, page_loading: !!page_loading };
      let targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      let phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      view.withinTargets(phxTarget, (targetView, targetCtx) => {
        if (eventType === "change") {
          let { newCid, _target, callback } = args;
          _target = _target || (sourceEl instanceof HTMLInputElement ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(sourceEl, targetCtx, newCid, event || phxEvent, pushOpts, callback);
        } else if (eventType === "submit") {
          targetView.submitForm(sourceEl, targetCtx, event || phxEvent, pushOpts);
        } else {
          targetView.pushEvent(eventType, sourceEl, targetCtx, event || phxEvent, data, pushOpts);
        }
      });
    },
    exec_add_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view);
    },
    exec_remove_class(eventType, phxEvent, view, sourceEl, el, { names, transition, time }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view);
    },
    exec_transition(eventType, phxEvent, view, sourceEl, el, { time, transition }) {
      let [transition_start, running, transition_end] = transition;
      let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(running), []);
      let onDone = () => this.addOrRemoveClasses(el, transition_end, transition_start.concat(running));
      view.transition(time, onStart, onDone);
    },
    exec_toggle(eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time }) {
      this.toggle(eventType, view, el, display, ins, outs, time);
    },
    exec_show(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.show(eventType, view, el, display, transition, time);
    },
    exec_hide(eventType, phxEvent, view, sourceEl, el, { display, transition, time }) {
      this.hide(eventType, view, el, display, transition, time);
    },
    exec_set_attr(eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    show(eventType, view, el, display, transition, time) {
      if (!this.isVisible(el)) {
        this.toggle(eventType, view, el, display, transition, null, time);
      }
    },
    hide(eventType, view, el, display, transition, time) {
      if (this.isVisible(el)) {
        this.toggle(eventType, view, el, display, null, transition, time);
      }
    },
    toggle(eventType, view, el, display, ins, outs, time) {
      let [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      let [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          let onStart = () => {
            this.addOrRemoveClasses(el, outStartClasses, inClasses.concat(inStartClasses).concat(inEndClasses));
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, outEndClasses, outStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          if (eventType === "remove") {
            return;
          }
          let onStart = () => {
            this.addOrRemoveClasses(el, inStartClasses, outClasses.concat(outStartClasses).concat(outEndClasses));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => this.addOrRemoveClasses(el, inEndClasses, inStartClasses));
            });
          };
          el.dispatchEvent(new Event("phx:show-start"));
          view.transition(time, onStart, () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = "none");
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            dom_default.putSticky(el, "toggle", (currentEl) => currentEl.style.display = display || "block");
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view) {
      let [transition_run, transition_start, transition_end] = transition || [[], [], []];
      if (transition_run.length > 0) {
        let onStart = () => this.addOrRemoveClasses(el, transition_start.concat(transition_run), []);
        let onDone = () => this.addOrRemoveClasses(el, adds.concat(transition_end), removes.concat(transition_run).concat(transition_start));
        return view.transition(time, onStart, onDone);
      }
      window.requestAnimationFrame(() => {
        let [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        let keepAdds = adds.filter((name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name));
        let keepRemoves = removes.filter((name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name));
        let newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        let newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      let [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      let alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      let newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      let newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(sourceEl, { to }) {
      return to ? dom_default.all(document, to) : [sourceEl];
    }
  };
  var js_default = JS;
  var serializeForm = (form, meta, onlyNames = []) => {
    let formData = new FormData(form);
    let toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    let params = new URLSearchParams();
    for (let [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        params.append(key, val);
      }
    }
    for (let metaKey in meta) {
      params.append(metaKey, meta[metaKey]);
    }
    return params.toString();
  };
  var View = class {
    constructor(el, liveSocket2, parentView, flash) {
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      this.id = this.el.id;
      this.ref = 0;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.pendingDiffs = [];
      this.pruningCIDs = [];
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = this.parent ? null : [];
      this.viewHooks = {};
      this.uploaders = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        return {
          redirect: this.redirect ? this.href : void 0,
          url: this.redirect ? void 0 : this.href || void 0,
          params: this.connectParams(),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash
        };
      });
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams() {
      let params = this.liveSocket.params(this.el);
      let manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      let val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyed = true;
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      let onFinished = () => {
        callback();
        for (let id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(PHX_CONNECTED_CLASS, PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (let id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_DISCONNECTED_CLASS);
      }
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
    }
    triggerReconnected() {
      for (let id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    withinTargets(phxTarget, callback) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(phxTarget, (view) => callback(view, phxTarget));
      }
      if (isCid(phxTarget)) {
        let targets = dom_default.findComponentNodeList(this.el, phxTarget);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        let targets = Array.from(document.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(`nothing found matching the phx-target selector "${phxTarget}"`);
        }
        targets.forEach((target) => this.liveSocket.owner(target, (view) => callback(view, target)));
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      let { diff, reply, events, title } = Rendered.extract(rawDiff);
      if (title) {
        dom_default.putTitle(title);
      }
      callback({ diff, reply, events });
      return reply;
    }
    onJoin(resp) {
      let { rendered, container } = resp;
      if (container) {
        let [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      browser_default.dropLocal(this.liveSocket.localStorage, window.location.pathname, CONSECUTIVE_RELOADS);
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        let html = this.renderContainer(null, "join");
        this.dropPendingRefs();
        let forms = this.formsForRecovery(html);
        this.joinCount++;
        if (forms.length > 0) {
          forms.forEach(([form, newForm, newCid], i) => {
            this.pushFormRecovery(form, newCid, (resp2) => {
              if (i === forms.length - 1) {
                this.onJoinComplete(resp2, html, events);
              }
            });
          });
        } else {
          this.onJoinComplete(resp, html, events);
        }
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}]`, (el) => {
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
      });
    }
    onJoinComplete({ live_patch }, html, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, events);
      }
      let newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter((toEl) => {
        let fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
        let phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
        if (phxStatic) {
          toEl.setAttribute(PHX_STATIC, phxStatic);
        }
        return this.joinChild(toEl);
      });
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, events);
        }
      } else {
        this.root.pendingJoinOps.push([this, () => this.applyJoinPatch(live_patch, html, events)]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    applyJoinPatch(live_patch, html, events) {
      this.attachTrueDocEl();
      let patch = new DOMPatch(this, this.el, this.id, html, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false);
      this.joinNewChildren();
      dom_default.all(this.el, `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`, (hookEl) => {
        let hook = this.addHook(hookEl);
        if (hook) {
          hook.__mounted();
        }
      });
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        let { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      let hook = this.getHook(fromEl);
      let isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    performPatch(patch, pruneCids) {
      let removedEls = [];
      let phxChildrenAdded = false;
      let updatedHookIds = /* @__PURE__ */ new Set();
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        let newHook = this.addHook(el);
        if (newHook) {
          newHook.__mounted();
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        let hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after("transitionsDiscarded", (els) => this.afterElementsRemoved(els, pruneCids));
      patch.perform();
      this.afterElementsRemoved(removedEls, pruneCids);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      let destroyedCIDs = [];
      elements.forEach((parent) => {
        let components = dom_default.all(parent, `[${PHX_COMPONENT}]`);
        let hooks = dom_default.all(parent, `[${this.binding(PHX_HOOK)}]`);
        components.concat(parent).forEach((el) => {
          let cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1) {
            destroyedCIDs.push(cid);
          }
        });
        hooks.concat(parent).forEach((hookEl) => {
          let hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(this.el, this.id).forEach((el) => this.joinChild(el));
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      if (el.id === this.id) {
        return this;
      } else {
        return this.children[el.getAttribute(PHX_PARENT_ID)][el.id];
      }
    }
    destroyDescendent(id) {
      for (let parentId in this.root.children) {
        for (let childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      let child = this.getChildById(el.id);
      if (!child) {
        let view = new View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && !dom_default.isPhxSticky(this.el)) {
        return this.pendingDiffs.push({ diff, events });
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          let parentCids = dom_default.findParentCIDs(this.el, this.rendered.componentCIDs(diff));
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(this.rendered.getComponent(diff, parentCID), parentCID)) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          let html = this.renderContainer(diff, "update");
          let patch = new DOMPatch(this, this.el, this.id, html, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        let tag = this.el.tagName;
        let cids = diff ? this.rendered.componentCIDs(diff).concat(this.pruningCIDs) : null;
        let html = this.rendered.toString(cids);
        return `<${tag}>${html}</${tag}>`;
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      let html = this.rendered.componentToString(cid);
      let patch = new DOMPatch(this, this.el, this.id, html, cid);
      let childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      if (ViewHook.elementID(el) || !el.getAttribute) {
        return;
      }
      let hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
      if (hookName && !this.ownsElement(el)) {
        return;
      }
      let callbacks = this.liveSocket.getHookCallbacks(hookName);
      if (callbacks) {
        if (!el.id) {
          logError(`no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`, el);
        }
        let hook = new ViewHook(this, el, callbacks);
        this.viewHooks[ViewHook.elementID(hook.el)] = hook;
        return hook;
      } else if (hookName !== null) {
        logError(`unknown hook found for "${hookName}"`, el);
      }
    }
    destroyHook(hook) {
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[ViewHook.elementID(hook.el)];
    }
    applyPendingUpdates() {
      this.pendingDiffs.forEach(({ diff, events }) => this.update(diff, events));
      this.pendingDiffs = [];
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          this.root.pendingJoinOps.push([this, () => cb(resp)]);
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff("update", rawDiff, ({ diff, events }) => this.update(diff, events));
        });
      });
      this.onChannel("redirect", ({ to, flash }) => this.onRedirect({ to, flash }));
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      for (let id in this.root.children[this.id]) {
        this.getChildById(id).destroy();
      }
    }
    onLiveRedirect(redir) {
      let { to, kind, flash } = redir;
      let url = this.expandURL(to);
      this.liveSocket.historyRedirect(url, kind, flash);
    }
    onLivePatch(redir) {
      let { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    onRedirect({ to, flash }) {
      this.liveSocket.redirect(to, flash);
    }
    isDestroyed() {
      return this.destroyed;
    }
    join(callback) {
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({ to: this.href, kind: "initial" });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.liveSocket.wrapPush(this, { timeout: false }, () => {
        return this.channel.join().receive("ok", (data) => {
          if (!this.isDestroyed()) {
            this.liveSocket.requestDOMUpdate(() => this.onJoin(data));
          }
        }).receive("error", (resp) => !this.isDestroyed() && this.onJoinError(resp)).receive("timeout", () => !this.isDestroyed() && this.onJoinError({ reason: "timeout" }));
      });
    }
    onJoinError(resp) {
      if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => ["unauthorized live_redirect. Falling back to page request", resp]);
        return this.onRedirect({ to: this.href });
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.liveSocket.isConnected()) {
        this.liveSocket.reloadWithJitter(this);
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (document.activeElement) {
        document.activeElement.blur();
      }
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        this.displayError();
      }
    }
    displayError() {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: { to: this.href, kind: "error" } });
      }
      this.showLoader();
      this.setContainerClasses(PHX_DISCONNECTED_CLASS, PHX_ERROR_CLASS);
    }
    pushWithReply(refGenerator, event, payload, onReply = function() {
    }) {
      if (!this.isConnected()) {
        return;
      }
      let [ref, [el], opts] = refGenerator ? refGenerator() : [null, [], {}];
      let onLoadingDone = function() {
      };
      if (opts.page_loading || el && el.getAttribute(this.binding(PHX_PAGE_LOADING)) !== null) {
        onLoadingDone = this.liveSocket.withPageLoading({ kind: "element", target: el });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return this.liveSocket.wrapPush(this, { timeout: true }, () => {
        return this.channel.push(event, payload, PUSH_TIMEOUT).receive("ok", (resp) => {
          if (ref !== null) {
            this.undoRefs(ref);
          }
          let finish = (hookReply) => {
            if (resp.redirect) {
              this.onRedirect(resp.redirect);
            }
            if (resp.live_patch) {
              this.onLivePatch(resp.live_patch);
            }
            if (resp.live_redirect) {
              this.onLiveRedirect(resp.live_redirect);
            }
            onLoadingDone();
            onReply(resp, hookReply);
          };
          if (resp.diff) {
            this.liveSocket.requestDOMUpdate(() => {
              let hookReply = this.applyDiff("update", resp.diff, ({ diff, events }) => {
                this.update(diff, events);
              });
              finish(hookReply);
            });
          } else {
            finish(null);
          }
        });
      });
    }
    undoRefs(ref) {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.id}"][${PHX_REF}="${ref}"]`, (el) => {
        let disabledVal = el.getAttribute(PHX_DISABLED);
        el.removeAttribute(PHX_REF);
        el.removeAttribute(PHX_REF_SRC);
        if (el.getAttribute(PHX_READONLY) !== null) {
          el.readOnly = false;
          el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          el.disabled = disabledVal === "true" ? true : false;
          el.removeAttribute(PHX_DISABLED);
        }
        PHX_EVENT_CLASSES.forEach((className) => dom_default.removeClass(el, className));
        let disableRestore = el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          el.innerText = disableRestore;
          el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        let toEl = dom_default.private(el, PHX_REF);
        if (toEl) {
          let hook = this.triggerBeforeUpdateHook(el, toEl);
          DOMPatch.patchEl(el, toEl, this.liveSocket.getActiveElement());
          if (hook) {
            hook.__updated();
          }
          dom_default.deletePrivate(el, PHX_REF);
        }
      });
    }
    putRef(elements, event, opts = {}) {
      let newRef = this.ref++;
      let disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        elements = elements.concat(dom_default.all(document, opts.loading));
      }
      elements.forEach((el) => {
        el.classList.add(`phx-${event}-loading`);
        el.setAttribute(PHX_REF, newRef);
        el.setAttribute(PHX_REF_SRC, this.el.id);
        let disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.innerText);
          }
          if (disableText !== "") {
            el.innerText = disableText;
          }
          el.setAttribute("disabled", "");
        }
      });
      return [newRef, elements, opts];
    }
    componentID(el) {
      let cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      let cidOrSelector = target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(targetCtx.closest(`[${PHX_COMPONENT}]`), (el) => this.ownsElement(el) && this.componentID(el));
      } else {
        return null;
      }
    }
    pushHookEvent(targetCtx, event, payload, onReply) {
      if (!this.isConnected()) {
        this.log("hook", () => ["unable to push hook event. LiveView not connected", event, payload]);
        return false;
      }
      let [ref, els, opts] = this.putRef([], "hook");
      this.pushWithReply(() => [ref, els, opts], "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }, (resp, reply) => onReply(reply, ref));
      return ref;
    }
    extractMeta(el, meta, value) {
      let prefix = this.binding("value-");
      for (let i = 0; i < el.attributes.length; i++) {
        if (!meta) {
          meta = {};
        }
        let name = el.attributes[i].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (let key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}) {
      this.pushWithReply(() => this.putRef([el], type, opts), "event", {
        type,
        event: phxEvent,
        value: this.extractMeta(el, meta, opts.value),
        cid: this.targetComponentID(el, targetCtx, opts)
      });
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }, onReply);
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      let uploads;
      let cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx);
      let refGenerator = () => this.putRef([inputEl, inputEl.form], "change", opts);
      let formData;
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, { _target: opts._target }, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, { _target: opts._target });
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      let event = {
        type: "form",
        event: phxEvent,
        value: formData,
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event, (resp) => {
        dom_default.showError(inputEl, this.liveSocket.binding(PHX_FEEDBACK_FOR));
        if (dom_default.isUploadInput(inputEl) && inputEl.getAttribute("data-phx-auto-upload") !== null) {
          if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
            let [ref, _els] = refGenerator();
            this.uploadFiles(inputEl.form, targetCtx, ref, cid, (_uploads) => {
              callback && callback(resp);
              this.triggerAwaitingSubmit(inputEl.form);
            });
          }
        } else {
          callback && callback(resp);
        }
      });
    }
    triggerAwaitingSubmit(formEl) {
      let awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        let [_el, _ref, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(([el, _ref, _opts, _callback]) => el.isSameNode(formEl));
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl) {
      this.formSubmits = this.formSubmits.filter(([el, ref, _callback]) => {
        if (el.isSameNode(formEl)) {
          this.undoRefs(ref);
          return false;
        } else {
          return true;
        }
      });
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply) {
      let filterIgnored = (el) => {
        let userIgnored = closestPhxBinding(el, `${this.binding(PHX_UPDATE)}=ignore`, el.form);
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      let filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      let filterButton = (el) => el.tagName == "BUTTON";
      let filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      let refGenerator = () => {
        let formElements = Array.from(formEl.elements);
        let disables = formElements.filter(filterDisables);
        let buttons = formElements.filter(filterButton).filter(filterIgnored);
        let inputs = formElements.filter(filterInput).filter(filterIgnored);
        buttons.forEach((button) => {
          button.setAttribute(PHX_DISABLED, button.disabled);
          button.disabled = true;
        });
        inputs.forEach((input) => {
          input.setAttribute(PHX_READONLY, input.readOnly);
          input.readOnly = true;
          if (input.files) {
            input.setAttribute(PHX_DISABLED, input.disabled);
            input.disabled = true;
          }
        });
        formEl.setAttribute(this.binding(PHX_PAGE_LOADING), "");
        return this.putRef([formEl].concat(disables).concat(buttons).concat(inputs), "submit", opts);
      };
      let cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        let [ref, _els] = refGenerator();
        let push = () => this.pushFormSubmit(formEl, targetCtx, phxEvent, opts, onReply);
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        let [ref, els] = refGenerator();
        let proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, targetCtx, ref, cid, (_uploads) => {
          let formData = serializeForm(formEl, {});
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            cid
          }, onReply);
        });
      } else {
        let formData = serializeForm(formEl, {});
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          cid
        }, onReply);
      }
    }
    uploadFiles(formEl, targetCtx, ref, cid, onComplete) {
      let joinCountAtUpload = this.joinCount;
      let inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        let uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        this.uploaders[inputEl] = uploader;
        let entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        let payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload, (resp) => {
          this.log("upload", () => ["got preflight response", resp]);
          if (resp.error) {
            this.undoRefs(ref);
            let [entry_ref, reason] = resp.error;
            this.log("upload", () => [`error for entry ${entry_ref}`, reason]);
          } else {
            let onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        });
      });
    }
    dispatchUploads(name, filesOrBlobs) {
      let inputs = dom_default.findUploadInputs(this.el).filter((el) => el.name === name);
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, { detail: { files: filesOrBlobs } });
      }
    }
    pushFormRecovery(form, newCid, callback) {
      this.liveSocket.withinOwners(form, (view, targetCtx) => {
        let input = form.elements[0];
        let phxEvent = form.getAttribute(this.binding(PHX_AUTO_RECOVER)) || form.getAttribute(this.binding("change"));
        js_default.exec("change", phxEvent, view, input, ["push", { _target: input.name, newCid, callback }]);
      });
    }
    pushLinkPatch(href, targetEl, callback) {
      let linkRef = this.liveSocket.setPendingLink(href);
      let refGen = targetEl ? () => this.putRef([targetEl], "click") : null;
      let fallback = () => this.liveSocket.redirect(window.location.href);
      let push = this.pushWithReply(refGen, "live_patch", { url: href }, (resp) => {
        this.liveSocket.requestDOMUpdate(() => {
          if (resp.link_redirect) {
            this.liveSocket.replaceMain(href, null, callback, linkRef);
          } else {
            if (this.liveSocket.commitPendingLink(linkRef)) {
              this.href = href;
            }
            this.applyPendingUpdates();
            callback && callback(linkRef);
          }
        });
      });
      if (push) {
        push.receive("timeout", fallback);
      } else {
        fallback();
      }
    }
    formsForRecovery(html) {
      if (this.joinCount === 0) {
        return [];
      }
      let phxChange = this.binding("change");
      let template = document.createElement("template");
      template.innerHTML = html;
      return dom_default.all(this.el, `form[${phxChange}]`).filter((form) => form.id && this.ownsElement(form)).filter((form) => form.elements.length > 0).filter((form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore").map((form) => {
        let newForm = template.content.querySelector(`form[id="${form.id}"][${phxChange}="${form.getAttribute(phxChange)}"]`);
        if (newForm) {
          return [form, newForm, this.targetComponentID(newForm)];
        } else {
          return [form, null, null];
        }
      }).filter(([form, newForm, newCid]) => newForm);
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.el, cid).length === 0;
      });
      if (willDestroyCIDs.length > 0) {
        this.pruningCIDs.push(...willDestroyCIDs);
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }, () => {
          this.pruningCIDs = this.pruningCIDs.filter((cid) => willDestroyCIDs.indexOf(cid) !== -1);
          let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
            return dom_default.findComponentNodeList(this.el, cid).length === 0;
          });
          if (completelyDestroyCIDs.length > 0) {
            this.pushWithReply(null, "cids_destroyed", { cids: completelyDestroyCIDs }, (resp) => {
              this.rendered.pruneCIDs(resp.cids);
            });
          }
        });
      }
    }
    ownsElement(el) {
      return el.getAttribute(PHX_PARENT_ID) === this.id || maybe(el.closest(PHX_VIEW_SELECTOR), (node) => node.id) === this.id;
    }
    submitForm(form, targetCtx, phxEvent, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      let phxFeedback = this.liveSocket.binding(PHX_FEEDBACK_FOR);
      let inputs = Array.from(form.elements);
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, opts, () => {
        inputs.forEach((input) => dom_default.showError(input, phxFeedback));
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.activeElement = null;
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.domCallbacks = Object.assign({ onNodeAdded: closure2(), onBeforeElUpdated: closure2() }, opts.dom || {});
      this.transitions = new TransitionSet();
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log("latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable");
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      let str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      let doConnect = () => {
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        }
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    execJS(el, encodedJS, eventType = null) {
      this.owner(el, (view) => js_default.exec(eventType, encodedJS, view, el));
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      let result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        let [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        let [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        let latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          console.log(`simulating ${latency}ms of latency from server to client`);
          setTimeout(() => cb(data), latency);
        }
      });
    }
    wrapPush(view, opts, push) {
      let latency = this.getLatencySim();
      let oldJoinCount = view.joinCount;
      if (!latency) {
        if (this.isConnected() && opts.timeout) {
          return push().receive("timeout", () => {
            if (view.joinCount === oldJoinCount && !view.isDestroyed()) {
              this.reloadWithJitter(view, () => {
                this.log(view, "timeout", () => ["received timeout while communicating with server. Falling back to hard refresh for recovery"]);
              });
            }
          });
        } else {
          return push();
        }
      }
      console.log(`simulating ${latency}ms of latency from client to server`);
      let fakePush = {
        receives: [],
        receive(kind, cb) {
          this.receives.push([kind, cb]);
        }
      };
      setTimeout(() => {
        if (view.isDestroyed()) {
          return;
        }
        fakePush.receives.reduce((acc, [kind, cb]) => acc.receive(kind, cb), push());
      }, latency);
      return fakePush;
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      let minMs = this.reloadJitterMin;
      let maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      let tries = browser_default.updateLocal(this.localStorage, window.location.pathname, CONSECUTIVE_RELOADS, 0, (count) => count + 1);
      if (tries > this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [`encountered ${tries} consecutive reloads`]);
        if (tries > this.maxReloads) {
          this.log(view, "join", () => [`exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookCallbacks(name) {
      return name && name.startsWith("Phoenix.") ? hooks_default[name.split(".")[1]] : this.hooks[name];
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(document, `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`, (rootEl) => {
        if (!this.getRootById(rootEl.id)) {
          let view = this.newRootView(rootEl);
          view.setHref(this.getHref());
          view.join();
          if (rootEl.hasAttribute(PHX_MAIN)) {
            this.main = view;
          }
        }
        rootsFound = true;
      });
      return rootsFound;
    }
    redirect(to, flash) {
      this.disconnect();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      let newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash);
      this.main.setRedirect(href);
      this.transitionRemoves();
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            dom_default.findPhxSticky(document).forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && requestAnimationFrame(callback);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements) {
      let removeAttr = this.binding("remove");
      elements = elements || dom_default.all(document, `[${removeAttr}]`);
      elements.forEach((el) => {
        if (document.body.contains(el)) {
          this.execJS(el, el.getAttribute(removeAttr), "remove");
        }
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash) {
      let view = new View(el, this, null, flash);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view = maybe(childEl.closest(PHX_VIEW_SELECTOR), (el) => this.getViewByEl(el)) || this.main;
      if (view) {
        callback(view);
      }
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      let rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(this.getRootById(rootId), (root) => root.getDescendentByEl(el));
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (let id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      let root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    setActiveElement(target) {
      if (this.activeElement === target) {
        return;
      }
      this.activeElement = target;
      let cancel = () => {
        if (target === this.activeElement) {
          this.activeElement = null;
        }
        target.removeEventListener("mouseup", this);
        target.removeEventListener("touchend", this);
      };
      target.addEventListener("mouseup", cancel);
      target.addEventListener("touchend", cancel);
    }
    getActiveElement() {
      if (document.activeElement === document.body) {
        return this.activeElement || document.activeElement;
      } else {
        return document.activeElement || document.body;
      }
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body) {
        this.prevActive.blur();
      }
    }
    bindTopLevelEvents() {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener("pageshow", (e) => {
        if (e.persisted) {
          this.getSocket().disconnect();
          this.withPageLoading({ to: window.location.href, kind: "redirect" });
          window.location.reload();
        }
      }, true);
      this.bindNav();
      this.bindClicks();
      this.bindForms();
      this.bind({ keyup: "keyup", keydown: "keydown" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        let matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
        let pressedKey = e.key && e.key.toLowerCase();
        if (matchKey && matchKey.toLowerCase() !== pressedKey) {
          return;
        }
        let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
        js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
      });
      this.bind({ blur: "focusout", focus: "focusin" }, (e, type, view, targetEl, phxEvent, eventTarget) => {
        if (!eventTarget) {
          let data = __spreadValues({ key: e.key }, this.eventMeta(type, e, targetEl));
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      this.bind({ blur: "blur", focus: "focus" }, (e, type, view, targetEl, targetCtx, phxEvent, phxTarget) => {
        if (phxTarget === "window") {
          let data = this.eventMeta(type, e, targetEl);
          js_default.exec(type, phxEvent, view, targetEl, ["push", { data }]);
        }
      });
      window.addEventListener("dragover", (e) => e.preventDefault());
      window.addEventListener("drop", (e) => {
        e.preventDefault();
        let dropTargetId = maybe(closestPhxBinding(e.target, this.binding(PHX_DROP_TARGET)), (trueTarget) => {
          return trueTarget.getAttribute(this.binding(PHX_DROP_TARGET));
        });
        let dropTarget = dropTargetId && document.getElementById(dropTargetId);
        let files = Array.from(e.dataTransfer.files || []);
        if (!dropTarget || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e) => {
        let uploadTarget = e.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        let files = Array.from(e.detail.files || []).filter((f) => f instanceof File || f instanceof Blob);
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e, targetEl) {
      let callback = this.metadataCallbacks[eventName];
      return callback ? callback(e, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      return this.linkRef;
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (let event in events) {
        let browserEventName = events[event];
        this.on(browserEventName, (e) => {
          let binding = this.binding(event);
          let windowBinding = this.binding(`window-${event}`);
          let targetPhxEvent = e.target.getAttribute && e.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e.target, e, browserEventName, () => {
              this.withinOwners(e.target, (view) => {
                callback(e, event, view, e.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              let phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      window.addEventListener("mousedown", (e) => this.clickStartedAtTarget = e.target);
      this.bindClick("click", "click", false);
      this.bindClick("mousedown", "capture-click", true);
    }
    bindClick(eventName, bindingName, capture) {
      let click = this.binding(bindingName);
      window.addEventListener(eventName, (e) => {
        let target = null;
        if (capture) {
          target = e.target.matches(`[${click}]`) ? e.target : e.target.querySelector(`[${click}]`);
        } else {
          let clickStartedAtTarget = this.clickStartedAtTarget || e.target;
          target = closestPhxBinding(clickStartedAtTarget, click);
          this.dispatchClickAway(e, clickStartedAtTarget);
          this.clickStartedAtTarget = null;
        }
        let phxEvent = target && target.getAttribute(click);
        if (!phxEvent) {
          return;
        }
        if (target.getAttribute("href") === "#") {
          e.preventDefault();
        }
        this.debounce(target, e, "click", () => {
          this.withinOwners(target, (view) => {
            js_default.exec("click", phxEvent, view, target, ["push", { data: this.eventMeta("click", e, target) }]);
          });
        });
      }, capture);
    }
    dispatchClickAway(e, clickStartedAt) {
      let phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt))) {
          this.withinOwners(e.target, (view) => {
            let phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el)) {
              js_default.exec("click", phxEvent, view, el, ["push", { data: this.eventMeta("click", e, e.target) }]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState((state) => Object.assign(state, { scroll: window.scrollY }));
        }, 100);
      });
      window.addEventListener("popstate", (event) => {
        if (!this.registerNewLocation(window.location)) {
          return;
        }
        let { type, id, root, scroll } = event.state || {};
        let href = window.location.href;
        this.requestDOMUpdate(() => {
          if (this.main.isConnected() && (type === "patch" && id === this.main.id)) {
            this.main.pushLinkPatch(href, null);
          } else {
            this.replaceMain(href, null, () => {
              if (root) {
                this.replaceRootHistory();
              }
              if (typeof scroll === "number") {
                setTimeout(() => {
                  window.scrollTo(0, scroll);
                }, 0);
              }
            });
          }
        });
      }, false);
      window.addEventListener("click", (e) => {
        let target = closestPhxBinding(e.target, PHX_LIVE_LINK);
        let type = target && target.getAttribute(PHX_LIVE_LINK);
        let wantsNewTab = e.metaKey || e.ctrlKey || e.button === 1;
        if (!type || !this.isConnected() || !this.main || wantsNewTab) {
          return;
        }
        let href = target.href;
        let linkState = target.getAttribute(PHX_LINK_STATE);
        e.preventDefault();
        e.stopImmediatePropagation();
        if (this.pendingLink === href) {
          return;
        }
        this.requestDOMUpdate(() => {
          if (type === "patch") {
            this.pushHistoryPatch(href, linkState, target);
          } else if (type === "redirect") {
            this.historyRedirect(href, linkState);
          } else {
            throw new Error(`expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`);
          }
        });
      }, false);
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      let done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(href, linkState, targetEl) {
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      browser_default.pushState(linkState, { type: "patch", id: this.main.id }, href);
      this.registerNewLocation(window.location);
    }
    historyRedirect(href, linkState, flash) {
      let scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, () => {
          browser_default.pushState(linkState, { type: "redirect", id: this.main.id, scroll }, href);
          this.registerNewLocation(window.location);
          done();
        });
      });
    }
    replaceRootHistory() {
      browser_default.pushState("replace", { root: true, type: "patch", id: this.main.id });
    }
    registerNewLocation(newLocation) {
      let { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      this.on("submit", (e) => {
        let phxEvent = e.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          return;
        }
        e.preventDefault();
        e.target.disabled = true;
        this.withinOwners(e.target, (view) => {
          js_default.exec("submit", phxEvent, view, e.target, ["push", {}]);
        });
      }, false);
      for (let type of ["change", "input"]) {
        this.on(type, (e) => {
          let phxChange = this.binding("change");
          let input = e.target;
          let inputEvent = input.getAttribute(phxChange);
          let formEvent = input.form && input.form.getAttribute(phxChange);
          let phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          let dispatcher = inputEvent ? input : input.form;
          let currentIterations = iterations;
          iterations++;
          let { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type !== lastType) {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", { at: currentIterations, type });
          this.debounce(input, e, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              if (!dom_default.isTextualInput(input)) {
                this.setActiveElement(input);
              }
              js_default.exec("change", phxEvent, view, input, ["push", { _target: e.target.name, dispatcher }]);
            });
          });
        }, false);
      }
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      let phxDebounce = this.binding(PHX_DEBOUNCE);
      let phxThrottle = this.binding(PHX_THROTTLE);
      let defaultDebounce = this.defaults.debounce.toString();
      let defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        let asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, () => {
          callback();
        });
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      window.addEventListener(event, (e) => {
        if (!this.silenced) {
          callback(e);
        }
      });
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.pendingOps = [];
      this.reset();
    }
    reset() {
      this.transitions.forEach((timer) => {
        cancelTimeout(timer);
        this.transitions.delete(timer);
      });
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      let timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        if (this.size() === 0) {
          this.flushPendingOps();
        }
      }, time);
      this.transitions.add(timer);
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size;
    }
    flushPendingOps() {
      this.pendingOps.forEach((op) => op());
      this.pendingOps = [];
    }
  };

  // js/app.js
  var import_topbar = __toESM(require_topbar());

  // node_modules/export-to-csv/output/index.js
  var v = { fieldSeparator: ",", decimalSeparator: ".", quoteStrings: true, quoteCharacter: '"', showTitle: false, title: "My Generated Report", filename: "generated", showColumnHeaders: true, useTextFile: false, useBom: true, columnHeaders: [], useKeysAsHeaders: false, boolDisplay: { true: "TRUE", false: "FALSE" }, replaceUndefinedWith: "" };
  var B = "\r\n";
  var F = "\uFEFF";
  var Y = (x) => Object.assign({}, v, x);
  var Z = class extends Error {
    constructor(x) {
      super(x);
      this.name = "CsvGenerationError";
    }
  };
  var _ = class extends Error {
    constructor(x) {
      super(x);
      this.name = "EmptyHeadersError";
    }
  };
  var $ = class extends Error {
    constructor(x) {
      super(x);
      this.name = "CsvDownloadEnvironmentError";
    }
  };
  var U = (x) => x;
  var z = (x) => x;
  var W = U;
  var X = U;
  var Q = U;
  var T = U;
  var w = function(x, A) {
    if (A == '"' && x.indexOf('"') > -1)
      return x.replace(/"/g, '""');
    return x;
  };
  var H = (x) => typeof x === "object" ? Q(x.key) : Q(x);
  var D = (x) => typeof x === "object" ? T(x.displayLabel) : T(x);
  var V = (x, ...A) => A.reduce((N, j) => j(N), x);
  var K = (x) => (A) => x.useBom ? W(z(A) + F) : A;
  var L = (x) => (A) => x.showTitle ? W(z(A) + x.title) : A;
  var P = (x) => (A) => W(z(x) + z(A) + B);
  var R = (x) => (A, N) => h(x)(X(A + N));
  var h = (x) => (A) => U(z(A) + x.fieldSeparator);
  var E = (x, A) => (N) => {
    if (!x.showColumnHeaders)
      return N;
    if (A.length < 1)
      throw new _("Option to show headers but none supplied. Make sure there are keys in your collection or that you've supplied headers through the config options.");
    let j = X("");
    for (let G = 0; G < A.length; G++) {
      const J = D(A[G]);
      j = R(x)(j, C(x, J));
    }
    return j = X(z(j).slice(0, -1)), P(N)(j);
  };
  var O = (x, A, N) => (j) => {
    let G = j;
    for (var J = 0; J < N.length; J++) {
      let S = X("");
      for (let I = 0; I < A.length; I++) {
        const q = H(A[I]), b = typeof N[J][z(q)] === "undefined" ? x.replaceUndefinedWith : N[J][z(q)];
        S = R(x)(S, C(x, b));
      }
      S = X(z(S).slice(0, -1)), G = P(G)(S);
    }
    return G;
  };
  var M = (x) => +x === x && (!isFinite(x) || Boolean(x % 1));
  var C = (x, A) => {
    if (x.decimalSeparator === "locale" && M(A))
      return A.toLocaleString();
    if (x.decimalSeparator !== "." && M(A))
      return A.toString().replace(".", x.decimalSeparator);
    if (typeof A === "string") {
      let N = A;
      if (x.quoteStrings || x.fieldSeparator && A.indexOf(x.fieldSeparator) > -1 || x.quoteCharacter && A.indexOf(x.quoteCharacter) > -1 || A.indexOf("\n") > -1 || A.indexOf("\r") > -1)
        N = x.quoteCharacter + w(A, x.quoteCharacter) + x.quoteCharacter;
      return N;
    }
    if (typeof A === "boolean" && x.boolDisplay) {
      const N = A ? "true" : "false";
      return x.boolDisplay[N];
    }
    return A;
  };
  var Gx = (x) => (A) => {
    const N = Y(x), j = N.useKeysAsHeaders ? Object.keys(A[0]) : N.columnHeaders;
    let G = V(W(""), K(N), L(N), E(N, j), O(N, j, A));
    if (z(G).length < 1)
      throw new Z("Output is empty. Is your data formatted correctly?");
    return G;
  };
  var Ix = (x) => (A) => {
    if (!window)
      throw new $("Downloading only supported in a browser environment.");
    const N = Y(x), j = z(A), G = N.useTextFile ? "plain" : "csv", J = N.useTextFile ? "txt" : "csv";
    let S = new Blob([j], { type: `text/${G};charset=utf8;` }), I = document.createElement("a");
    I.download = `${N.filename}.${J}`, I.href = URL.createObjectURL(S), I.setAttribute("visibility", "hidden"), document.body.appendChild(I), I.click(), document.body.removeChild(I);
  };

  // js/hooks/generateCsv.js
  var generateCsv_default = {
    mounted() {
      this.handleEvent("generate", ({ data }) => {
        today = new Date();
        const csvConfig = Y({
          useKeysAsHeaders: true,
          filename: `payments_${today.toISOString()}`
        });
        const formattedData = data.map((paymentData) => {
          const formattedBills = paymentData.bills.reduce((formatted, bill) => `${formatted}
${bill.name}:${bill.amount}`, "");
          return __spreadProps(__spreadValues({}, paymentData), {
            bills: formattedBills
          });
        });
        const csv = Gx(csvConfig)(formattedData);
        Ix(csvConfig)(csv);
      });
    }
  };

  // js/hooks.js
  var Hooks2 = {
    GenerateCSV: generateCsv_default
  };
  var hooks_default2 = Hooks2;

  // js/app.js
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket("/live", Socket, { params: { _csrf_token: csrfToken }, hooks: hooks_default2 });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (info) => import_topbar.default.show());
  window.addEventListener("phx:page-loading-stop", (info) => import_topbar.default.hide());
  liveSocket.connect();
  window.liveSocket = liveSocket;
})();
/**
 * @license MIT
 * topbar 1.0.0, 2021-01-06
 * https://buunguyen.github.io/topbar
 * Copyright (c) 2021 Buu Nguyen
 */
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXNzZXRzL3ZlbmRvci90b3BiYXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2h0bWwvcHJpdi9zdGF0aWMvcGhvZW5peF9odG1sLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC91dGlscy5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9wdXNoLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC90aW1lci5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvY2hhbm5lbC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvYWpheC5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXgvYXNzZXRzL2pzL3Bob2VuaXgvbG9uZ3BvbGwuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4L2Fzc2V0cy9qcy9waG9lbml4L3ByZXNlbmNlLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zZXJpYWxpemVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peC9hc3NldHMvanMvcGhvZW5peC9zb2NrZXQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvY29uc3RhbnRzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2VudHJ5X3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3V0aWxzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2Jyb3dzZXIuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvZG9tLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3VwbG9hZF9lbnRyeS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9saXZlX3VwbG9hZGVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2hvb2tzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2RvbV9wb3N0X21vcnBoX3Jlc3RvcmVyLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL25vZGVfbW9kdWxlcy9tb3JwaGRvbS9kaXN0L21vcnBoZG9tLWVzbS5qcyIsICIuLi8uLi8uLi9kZXBzL3Bob2VuaXhfbGl2ZV92aWV3L2Fzc2V0cy9qcy9waG9lbml4X2xpdmVfdmlldy9kb21fcGF0Y2guanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvcmVuZGVyZWQuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvdmlld19ob29rLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L2pzLmpzIiwgIi4uLy4uLy4uL2RlcHMvcGhvZW5peF9saXZlX3ZpZXcvYXNzZXRzL2pzL3Bob2VuaXhfbGl2ZV92aWV3L3ZpZXcuanMiLCAiLi4vLi4vLi4vZGVwcy9waG9lbml4X2xpdmVfdmlldy9hc3NldHMvanMvcGhvZW5peF9saXZlX3ZpZXcvbGl2ZV9zb2NrZXQuanMiLCAiLi4vLi4vLi4vYXNzZXRzL2pzL2FwcC5qcyIsICIuLi8uLi8uLi9hc3NldHMvbm9kZV9tb2R1bGVzL2V4cG9ydC10by1jc3Yvb3V0cHV0L2luZGV4LmpzIiwgIi4uLy4uLy4uL2Fzc2V0cy9qcy9ob29rcy9nZW5lcmF0ZUNzdi5qcyIsICIuLi8uLi8uLi9hc3NldHMvanMvaG9va3MuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogQGxpY2Vuc2UgTUlUXG4gKiB0b3BiYXIgMS4wLjAsIDIwMjEtMDEtMDZcbiAqIGh0dHBzOi8vYnV1bmd1eWVuLmdpdGh1Yi5pby90b3BiYXJcbiAqIENvcHlyaWdodCAoYykgMjAyMSBCdXUgTmd1eWVuXG4gKi9cbihmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICAvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9wYXVsaXJpc2gvMTU3OTY3MVxuICAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBsYXN0VGltZSA9IDA7XG4gICAgdmFyIHZlbmRvcnMgPSBbXCJtc1wiLCBcIm1velwiLCBcIndlYmtpdFwiLCBcIm9cIl07XG4gICAgZm9yICh2YXIgeCA9IDA7IHggPCB2ZW5kb3JzLmxlbmd0aCAmJiAhd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZTsgKyt4KSB7XG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID1cbiAgICAgICAgd2luZG93W3ZlbmRvcnNbeF0gKyBcIlJlcXVlc3RBbmltYXRpb25GcmFtZVwiXTtcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9XG4gICAgICAgIHdpbmRvd1t2ZW5kb3JzW3hdICsgXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiXSB8fFxuICAgICAgICB3aW5kb3dbdmVuZG9yc1t4XSArIFwiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCJdO1xuICAgIH1cbiAgICBpZiAoIXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpXG4gICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZnVuY3Rpb24gKGNhbGxiYWNrLCBlbGVtZW50KSB7XG4gICAgICAgIHZhciBjdXJyVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICB2YXIgdGltZVRvQ2FsbCA9IE1hdGgubWF4KDAsIDE2IC0gKGN1cnJUaW1lIC0gbGFzdFRpbWUpKTtcbiAgICAgICAgdmFyIGlkID0gd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGNhbGxiYWNrKGN1cnJUaW1lICsgdGltZVRvQ2FsbCk7XG4gICAgICAgIH0sIHRpbWVUb0NhbGwpO1xuICAgICAgICBsYXN0VGltZSA9IGN1cnJUaW1lICsgdGltZVRvQ2FsbDtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgfTtcbiAgICBpZiAoIXdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSlcbiAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICBjbGVhclRpbWVvdXQoaWQpO1xuICAgICAgfTtcbiAgfSkoKTtcblxuICB2YXIgY2FudmFzLFxuICAgIHByb2dyZXNzVGltZXJJZCxcbiAgICBmYWRlVGltZXJJZCxcbiAgICBjdXJyZW50UHJvZ3Jlc3MsXG4gICAgc2hvd2luZyxcbiAgICBhZGRFdmVudCA9IGZ1bmN0aW9uIChlbGVtLCB0eXBlLCBoYW5kbGVyKSB7XG4gICAgICBpZiAoZWxlbS5hZGRFdmVudExpc3RlbmVyKSBlbGVtLmFkZEV2ZW50TGlzdGVuZXIodHlwZSwgaGFuZGxlciwgZmFsc2UpO1xuICAgICAgZWxzZSBpZiAoZWxlbS5hdHRhY2hFdmVudCkgZWxlbS5hdHRhY2hFdmVudChcIm9uXCIgKyB0eXBlLCBoYW5kbGVyKTtcbiAgICAgIGVsc2UgZWxlbVtcIm9uXCIgKyB0eXBlXSA9IGhhbmRsZXI7XG4gICAgfSxcbiAgICBvcHRpb25zID0ge1xuICAgICAgYXV0b1J1bjogdHJ1ZSxcbiAgICAgIGJhclRoaWNrbmVzczogMyxcbiAgICAgIGJhckNvbG9yczoge1xuICAgICAgICAwOiBcInJnYmEoMjYsICAxODgsIDE1NiwgLjkpXCIsXG4gICAgICAgIFwiLjI1XCI6IFwicmdiYSg1MiwgIDE1MiwgMjE5LCAuOSlcIixcbiAgICAgICAgXCIuNTBcIjogXCJyZ2JhKDI0MSwgMTk2LCAxNSwgIC45KVwiLFxuICAgICAgICBcIi43NVwiOiBcInJnYmEoMjMwLCAxMjYsIDM0LCAgLjkpXCIsXG4gICAgICAgIFwiMS4wXCI6IFwicmdiYSgyMTEsIDg0LCAgMCwgICAuOSlcIixcbiAgICAgIH0sXG4gICAgICBzaGFkb3dCbHVyOiAxMCxcbiAgICAgIHNoYWRvd0NvbG9yOiBcInJnYmEoMCwgICAwLCAgIDAsICAgLjYpXCIsXG4gICAgICBjbGFzc05hbWU6IG51bGwsXG4gICAgfSxcbiAgICByZXBhaW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gb3B0aW9ucy5iYXJUaGlja25lc3MgKiA1OyAvLyBuZWVkIHNwYWNlIGZvciBzaGFkb3dcblxuICAgICAgdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjdHguc2hhZG93Qmx1ciA9IG9wdGlvbnMuc2hhZG93Qmx1cjtcbiAgICAgIGN0eC5zaGFkb3dDb2xvciA9IG9wdGlvbnMuc2hhZG93Q29sb3I7XG5cbiAgICAgIHZhciBsaW5lR3JhZGllbnQgPSBjdHguY3JlYXRlTGluZWFyR3JhZGllbnQoMCwgMCwgY2FudmFzLndpZHRoLCAwKTtcbiAgICAgIGZvciAodmFyIHN0b3AgaW4gb3B0aW9ucy5iYXJDb2xvcnMpXG4gICAgICAgIGxpbmVHcmFkaWVudC5hZGRDb2xvclN0b3Aoc3RvcCwgb3B0aW9ucy5iYXJDb2xvcnNbc3RvcF0pO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IG9wdGlvbnMuYmFyVGhpY2tuZXNzO1xuICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgY3R4Lm1vdmVUbygwLCBvcHRpb25zLmJhclRoaWNrbmVzcyAvIDIpO1xuICAgICAgY3R4LmxpbmVUbyhcbiAgICAgICAgTWF0aC5jZWlsKGN1cnJlbnRQcm9ncmVzcyAqIGNhbnZhcy53aWR0aCksXG4gICAgICAgIG9wdGlvbnMuYmFyVGhpY2tuZXNzIC8gMlxuICAgICAgKTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGxpbmVHcmFkaWVudDtcbiAgICAgIGN0eC5zdHJva2UoKTtcbiAgICB9LFxuICAgIGNyZWF0ZUNhbnZhcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICB2YXIgc3R5bGUgPSBjYW52YXMuc3R5bGU7XG4gICAgICBzdHlsZS5wb3NpdGlvbiA9IFwiZml4ZWRcIjtcbiAgICAgIHN0eWxlLnRvcCA9IHN0eWxlLmxlZnQgPSBzdHlsZS5yaWdodCA9IHN0eWxlLm1hcmdpbiA9IHN0eWxlLnBhZGRpbmcgPSAwO1xuICAgICAgc3R5bGUuekluZGV4ID0gMTAwMDAxO1xuICAgICAgc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgaWYgKG9wdGlvbnMuY2xhc3NOYW1lKSBjYW52YXMuY2xhc3NMaXN0LmFkZChvcHRpb25zLmNsYXNzTmFtZSk7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICBhZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHJlcGFpbnQpO1xuICAgIH0sXG4gICAgdG9wYmFyID0ge1xuICAgICAgY29uZmlnOiBmdW5jdGlvbiAob3B0cykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb3B0cylcbiAgICAgICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSBvcHRpb25zW2tleV0gPSBvcHRzW2tleV07XG4gICAgICB9LFxuICAgICAgc2hvdzogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc2hvd2luZykgcmV0dXJuO1xuICAgICAgICBzaG93aW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKGZhZGVUaW1lcklkICE9PSBudWxsKSB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoZmFkZVRpbWVySWQpO1xuICAgICAgICBpZiAoIWNhbnZhcykgY3JlYXRlQ2FudmFzKCk7XG4gICAgICAgIGNhbnZhcy5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgY2FudmFzLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgIHRvcGJhci5wcm9ncmVzcygwKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuYXV0b1J1bikge1xuICAgICAgICAgIChmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgICAgcHJvZ3Jlc3NUaW1lcklkID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShsb29wKTtcbiAgICAgICAgICAgIHRvcGJhci5wcm9ncmVzcyhcbiAgICAgICAgICAgICAgXCIrXCIgKyAwLjA1ICogTWF0aC5wb3coMSAtIE1hdGguc3FydChjdXJyZW50UHJvZ3Jlc3MpLCAyKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgcHJvZ3Jlc3M6IGZ1bmN0aW9uICh0bykge1xuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcInVuZGVmaW5lZFwiKSByZXR1cm4gY3VycmVudFByb2dyZXNzO1xuICAgICAgICBpZiAodHlwZW9mIHRvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdG8gPVxuICAgICAgICAgICAgKHRvLmluZGV4T2YoXCIrXCIpID49IDAgfHwgdG8uaW5kZXhPZihcIi1cIikgPj0gMFxuICAgICAgICAgICAgICA/IGN1cnJlbnRQcm9ncmVzc1xuICAgICAgICAgICAgICA6IDApICsgcGFyc2VGbG9hdCh0byk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2dyZXNzID0gdG8gPiAxID8gMSA6IHRvO1xuICAgICAgICByZXBhaW50KCk7XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvZ3Jlc3M7XG4gICAgICB9LFxuICAgICAgaGlkZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXNob3dpbmcpIHJldHVybjtcbiAgICAgICAgc2hvd2luZyA9IGZhbHNlO1xuICAgICAgICBpZiAocHJvZ3Jlc3NUaW1lcklkICE9IG51bGwpIHtcbiAgICAgICAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUocHJvZ3Jlc3NUaW1lcklkKTtcbiAgICAgICAgICBwcm9ncmVzc1RpbWVySWQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIChmdW5jdGlvbiBsb29wKCkge1xuICAgICAgICAgIGlmICh0b3BiYXIucHJvZ3Jlc3MoXCIrLjFcIikgPj0gMSkge1xuICAgICAgICAgICAgY2FudmFzLnN0eWxlLm9wYWNpdHkgLT0gMC4wNTtcbiAgICAgICAgICAgIGlmIChjYW52YXMuc3R5bGUub3BhY2l0eSA8PSAwLjA1KSB7XG4gICAgICAgICAgICAgIGNhbnZhcy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICAgIGZhZGVUaW1lcklkID0gbnVsbDtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmYWRlVGltZXJJZCA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUobG9vcCk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9LFxuICAgIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSB0b3BiYXI7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gXCJmdW5jdGlvblwiICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRvcGJhcjtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnRvcGJhciA9IHRvcGJhcjtcbiAgfVxufS5jYWxsKHRoaXMsIHdpbmRvdywgZG9jdW1lbnQpKTtcbiIsICJcInVzZSBzdHJpY3RcIjtcblxuKGZ1bmN0aW9uKCkge1xuICB2YXIgUG9seWZpbGxFdmVudCA9IGV2ZW50Q29uc3RydWN0b3IoKTtcblxuICBmdW5jdGlvbiBldmVudENvbnN0cnVjdG9yKCkge1xuICAgIGlmICh0eXBlb2Ygd2luZG93LkN1c3RvbUV2ZW50ID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiB3aW5kb3cuQ3VzdG9tRXZlbnQ7XG4gICAgLy8gSUU8PTkgU3VwcG9ydFxuICAgIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpIHtcbiAgICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7YnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZH07XG4gICAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgICAgcmV0dXJuIGV2dDtcbiAgICB9XG4gICAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgICByZXR1cm4gQ3VzdG9tRXZlbnQ7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZEhpZGRlbklucHV0KG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO1xuICAgIGlucHV0LnR5cGUgPSBcImhpZGRlblwiO1xuICAgIGlucHV0Lm5hbWUgPSBuYW1lO1xuICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgcmV0dXJuIGlucHV0O1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2xpY2soZWxlbWVudCwgdGFyZ2V0TW9kaWZpZXJLZXkpIHtcbiAgICB2YXIgdG8gPSBlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtdG9cIiksXG4gICAgICAgIG1ldGhvZCA9IGJ1aWxkSGlkZGVuSW5wdXQoXCJfbWV0aG9kXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1tZXRob2RcIikpLFxuICAgICAgICBjc3JmID0gYnVpbGRIaWRkZW5JbnB1dChcIl9jc3JmX3Rva2VuXCIsIGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jc3JmXCIpKSxcbiAgICAgICAgZm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmb3JtXCIpLFxuICAgICAgICBzdWJtaXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiksXG4gICAgICAgIHRhcmdldCA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwidGFyZ2V0XCIpO1xuXG4gICAgZm9ybS5tZXRob2QgPSAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW1ldGhvZFwiKSA9PT0gXCJnZXRcIikgPyBcImdldFwiIDogXCJwb3N0XCI7XG4gICAgZm9ybS5hY3Rpb24gPSB0bztcbiAgICBmb3JtLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcblxuICAgIGlmICh0YXJnZXQpIGZvcm0udGFyZ2V0ID0gdGFyZ2V0O1xuICAgIGVsc2UgaWYgKHRhcmdldE1vZGlmaWVyS2V5KSBmb3JtLnRhcmdldCA9IFwiX2JsYW5rXCI7XG5cbiAgICBmb3JtLmFwcGVuZENoaWxkKGNzcmYpO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQobWV0aG9kKTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGZvcm0pO1xuXG4gICAgLy8gSW5zZXJ0IGEgYnV0dG9uIGFuZCBjbGljayBpdCBpbnN0ZWFkIG9mIHVzaW5nIGBmb3JtLnN1Ym1pdGBcbiAgICAvLyBiZWNhdXNlIHRoZSBgc3VibWl0YCBmdW5jdGlvbiBkb2VzIG5vdCBlbWl0IGEgYHN1Ym1pdGAgZXZlbnQuXG4gICAgc3VibWl0LnR5cGUgPSBcInN1Ym1pdFwiO1xuICAgIGZvcm0uYXBwZW5kQ2hpbGQoc3VibWl0KTtcbiAgICBzdWJtaXQuY2xpY2soKTtcbiAgfVxuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIHZhciBlbGVtZW50ID0gZS50YXJnZXQ7XG4gICAgaWYgKGUuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuXG4gICAgd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5nZXRBdHRyaWJ1dGUpIHtcbiAgICAgIHZhciBwaG9lbml4TGlua0V2ZW50ID0gbmV3IFBvbHlmaWxsRXZlbnQoJ3Bob2VuaXgubGluay5jbGljaycsIHtcbiAgICAgICAgXCJidWJibGVzXCI6IHRydWUsIFwiY2FuY2VsYWJsZVwiOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgaWYgKCFlbGVtZW50LmRpc3BhdGNoRXZlbnQocGhvZW5peExpbmtFdmVudCkpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImRhdGEtbWV0aG9kXCIpKSB7XG4gICAgICAgIGhhbmRsZUNsaWNrKGVsZW1lbnQsIGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5KTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnROb2RlO1xuICAgICAgfVxuICAgIH1cbiAgfSwgZmFsc2UpO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdwaG9lbml4LmxpbmsuY2xpY2snLCBmdW5jdGlvbiAoZSkge1xuICAgIHZhciBtZXNzYWdlID0gZS50YXJnZXQuZ2V0QXR0cmlidXRlKFwiZGF0YS1jb25maXJtXCIpO1xuICAgIGlmKG1lc3NhZ2UgJiYgIXdpbmRvdy5jb25maXJtKG1lc3NhZ2UpKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9LCBmYWxzZSk7XG59KSgpO1xuIiwgIi8vIHdyYXBzIHZhbHVlIGluIGNsb3N1cmUgb3IgcmV0dXJucyBjbG9zdXJlXG5leHBvcnQgbGV0IGNsb3N1cmUgPSAodmFsdWUpID0+IHtcbiAgaWYodHlwZW9mIHZhbHVlID09PSBcImZ1bmN0aW9uXCIpe1xuICAgIHJldHVybiB2YWx1ZVxuICB9IGVsc2Uge1xuICAgIGxldCBjbG9zdXJlID0gZnVuY3Rpb24gKCl7IHJldHVybiB2YWx1ZSB9XG4gICAgcmV0dXJuIGNsb3N1cmVcbiAgfVxufVxuIiwgImV4cG9ydCBjb25zdCBnbG9iYWxTZWxmID0gdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogbnVsbFxuZXhwb3J0IGNvbnN0IHBoeFdpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiBudWxsXG5leHBvcnQgY29uc3QgZ2xvYmFsID0gZ2xvYmFsU2VsZiB8fCBwaHhXaW5kb3cgfHwgZ2xvYmFsXG5leHBvcnQgY29uc3QgREVGQVVMVF9WU04gPSBcIjIuMC4wXCJcbmV4cG9ydCBjb25zdCBTT0NLRVRfU1RBVEVTID0ge2Nvbm5lY3Rpbmc6IDAsIG9wZW46IDEsIGNsb3Npbmc6IDIsIGNsb3NlZDogM31cbmV4cG9ydCBjb25zdCBERUZBVUxUX1RJTUVPVVQgPSAxMDAwMFxuZXhwb3J0IGNvbnN0IFdTX0NMT1NFX05PUk1BTCA9IDEwMDBcbmV4cG9ydCBjb25zdCBDSEFOTkVMX1NUQVRFUyA9IHtcbiAgY2xvc2VkOiBcImNsb3NlZFwiLFxuICBlcnJvcmVkOiBcImVycm9yZWRcIixcbiAgam9pbmVkOiBcImpvaW5lZFwiLFxuICBqb2luaW5nOiBcImpvaW5pbmdcIixcbiAgbGVhdmluZzogXCJsZWF2aW5nXCIsXG59XG5leHBvcnQgY29uc3QgQ0hBTk5FTF9FVkVOVFMgPSB7XG4gIGNsb3NlOiBcInBoeF9jbG9zZVwiLFxuICBlcnJvcjogXCJwaHhfZXJyb3JcIixcbiAgam9pbjogXCJwaHhfam9pblwiLFxuICByZXBseTogXCJwaHhfcmVwbHlcIixcbiAgbGVhdmU6IFwicGh4X2xlYXZlXCJcbn1cblxuZXhwb3J0IGNvbnN0IFRSQU5TUE9SVFMgPSB7XG4gIGxvbmdwb2xsOiBcImxvbmdwb2xsXCIsXG4gIHdlYnNvY2tldDogXCJ3ZWJzb2NrZXRcIlxufVxuZXhwb3J0IGNvbnN0IFhIUl9TVEFURVMgPSB7XG4gIGNvbXBsZXRlOiA0XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHVzaFxuICogQHBhcmFtIHtDaGFubmVsfSBjaGFubmVsIC0gVGhlIENoYW5uZWxcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudCAtIFRoZSBldmVudCwgZm9yIGV4YW1wbGUgYFwicGh4X2pvaW5cImBcbiAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkIC0gVGhlIHBheWxvYWQsIGZvciBleGFtcGxlIGB7dXNlcl9pZDogMTIzfWBcbiAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IC0gVGhlIHB1c2ggdGltZW91dCBpbiBtaWxsaXNlY29uZHNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHVzaCB7XG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIGV2ZW50LCBwYXlsb2FkLCB0aW1lb3V0KXtcbiAgICB0aGlzLmNoYW5uZWwgPSBjaGFubmVsXG4gICAgdGhpcy5ldmVudCA9IGV2ZW50XG4gICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZCB8fCBmdW5jdGlvbiAoKXsgcmV0dXJuIHt9IH1cbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gICAgdGhpcy5yZWNIb29rcyA9IFtdXG4gICAgdGhpcy5zZW50ID0gZmFsc2VcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dFxuICAgKi9cbiAgcmVzZW5kKHRpbWVvdXQpe1xuICAgIHRoaXMudGltZW91dCA9IHRpbWVvdXRcbiAgICB0aGlzLnJlc2V0KClcbiAgICB0aGlzLnNlbmQoKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqL1xuICBzZW5kKCl7XG4gICAgaWYodGhpcy5oYXNSZWNlaXZlZChcInRpbWVvdXRcIikpeyByZXR1cm4gfVxuICAgIHRoaXMuc3RhcnRUaW1lb3V0KClcbiAgICB0aGlzLnNlbnQgPSB0cnVlXG4gICAgdGhpcy5jaGFubmVsLnNvY2tldC5wdXNoKHtcbiAgICAgIHRvcGljOiB0aGlzLmNoYW5uZWwudG9waWMsXG4gICAgICBldmVudDogdGhpcy5ldmVudCxcbiAgICAgIHBheWxvYWQ6IHRoaXMucGF5bG9hZCgpLFxuICAgICAgcmVmOiB0aGlzLnJlZixcbiAgICAgIGpvaW5fcmVmOiB0aGlzLmNoYW5uZWwuam9pblJlZigpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0geyp9IHN0YXR1c1xuICAgKiBAcGFyYW0geyp9IGNhbGxiYWNrXG4gICAqL1xuICByZWNlaXZlKHN0YXR1cywgY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuaGFzUmVjZWl2ZWQoc3RhdHVzKSl7XG4gICAgICBjYWxsYmFjayh0aGlzLnJlY2VpdmVkUmVzcC5yZXNwb25zZSlcbiAgICB9XG5cbiAgICB0aGlzLnJlY0hvb2tzLnB1c2goe3N0YXR1cywgY2FsbGJhY2t9KVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHJlc2V0KCl7XG4gICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgdGhpcy5yZWYgPSBudWxsXG4gICAgdGhpcy5yZWZFdmVudCA9IG51bGxcbiAgICB0aGlzLnJlY2VpdmVkUmVzcCA9IG51bGxcbiAgICB0aGlzLnNlbnQgPSBmYWxzZVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBtYXRjaFJlY2VpdmUoe3N0YXR1cywgcmVzcG9uc2UsIF9yZWZ9KXtcbiAgICB0aGlzLnJlY0hvb2tzLmZpbHRlcihoID0+IGguc3RhdHVzID09PSBzdGF0dXMpXG4gICAgICAuZm9yRWFjaChoID0+IGguY2FsbGJhY2socmVzcG9uc2UpKVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBjYW5jZWxSZWZFdmVudCgpe1xuICAgIGlmKCF0aGlzLnJlZkV2ZW50KXsgcmV0dXJuIH1cbiAgICB0aGlzLmNoYW5uZWwub2ZmKHRoaXMucmVmRXZlbnQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGNhbmNlbFRpbWVvdXQoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0VGltZXIpXG4gICAgdGhpcy50aW1lb3V0VGltZXIgPSBudWxsXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHN0YXJ0VGltZW91dCgpe1xuICAgIGlmKHRoaXMudGltZW91dFRpbWVyKXsgdGhpcy5jYW5jZWxUaW1lb3V0KCkgfVxuICAgIHRoaXMucmVmID0gdGhpcy5jaGFubmVsLnNvY2tldC5tYWtlUmVmKClcbiAgICB0aGlzLnJlZkV2ZW50ID0gdGhpcy5jaGFubmVsLnJlcGx5RXZlbnROYW1lKHRoaXMucmVmKVxuXG4gICAgdGhpcy5jaGFubmVsLm9uKHRoaXMucmVmRXZlbnQsIHBheWxvYWQgPT4ge1xuICAgICAgdGhpcy5jYW5jZWxSZWZFdmVudCgpXG4gICAgICB0aGlzLmNhbmNlbFRpbWVvdXQoKVxuICAgICAgdGhpcy5yZWNlaXZlZFJlc3AgPSBwYXlsb2FkXG4gICAgICB0aGlzLm1hdGNoUmVjZWl2ZShwYXlsb2FkKVxuICAgIH0pXG5cbiAgICB0aGlzLnRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy50cmlnZ2VyKFwidGltZW91dFwiLCB7fSlcbiAgICB9LCB0aGlzLnRpbWVvdXQpXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGhhc1JlY2VpdmVkKHN0YXR1cyl7XG4gICAgcmV0dXJuIHRoaXMucmVjZWl2ZWRSZXNwICYmIHRoaXMucmVjZWl2ZWRSZXNwLnN0YXR1cyA9PT0gc3RhdHVzXG4gIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHRyaWdnZXIoc3RhdHVzLCByZXNwb25zZSl7XG4gICAgdGhpcy5jaGFubmVsLnRyaWdnZXIodGhpcy5yZWZFdmVudCwge3N0YXR1cywgcmVzcG9uc2V9KVxuICB9XG59XG4iLCAiLyoqXG4gKlxuICogQ3JlYXRlcyBhIHRpbWVyIHRoYXQgYWNjZXB0cyBhIGB0aW1lckNhbGNgIGZ1bmN0aW9uIHRvIHBlcmZvcm1cbiAqIGNhbGN1bGF0ZWQgdGltZW91dCByZXRyaWVzLCBzdWNoIGFzIGV4cG9uZW50aWFsIGJhY2tvZmYuXG4gKlxuICogQGV4YW1wbGVcbiAqIGxldCByZWNvbm5lY3RUaW1lciA9IG5ldyBUaW1lcigoKSA9PiB0aGlzLmNvbm5lY3QoKSwgZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwMDAsIDUwMDAsIDEwMDAwXVt0cmllcyAtIDFdIHx8IDEwMDAwXG4gKiB9KVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgNTAwMFxuICogcmVjb25uZWN0VGltZXIucmVzZXQoKVxuICogcmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KCkgLy8gZmlyZXMgYWZ0ZXIgMTAwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0aW1lckNhbGNcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGltZXIge1xuICBjb25zdHJ1Y3RvcihjYWxsYmFjaywgdGltZXJDYWxjKXtcbiAgICB0aGlzLmNhbGxiYWNrID0gY2FsbGJhY2tcbiAgICB0aGlzLnRpbWVyQ2FsYyA9IHRpbWVyQ2FsY1xuICAgIHRoaXMudGltZXIgPSBudWxsXG4gICAgdGhpcy50cmllcyA9IDBcbiAgfVxuXG4gIHJlc2V0KCl7XG4gICAgdGhpcy50cmllcyA9IDBcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcilcbiAgfVxuXG4gIC8qKlxuICAgKiBDYW5jZWxzIGFueSBwcmV2aW91cyBzY2hlZHVsZVRpbWVvdXQgYW5kIHNjaGVkdWxlcyBjYWxsYmFja1xuICAgKi9cbiAgc2NoZWR1bGVUaW1lb3V0KCl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZXIpXG5cbiAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnRyaWVzID0gdGhpcy50cmllcyArIDFcbiAgICAgIHRoaXMuY2FsbGJhY2soKVxuICAgIH0sIHRoaXMudGltZXJDYWxjKHRoaXMudHJpZXMgKyAxKSlcbiAgfVxufVxuIiwgImltcG9ydCB7Y2xvc3VyZX0gZnJvbSBcIi4vdXRpbHNcIlxuaW1wb3J0IHtcbiAgQ0hBTk5FTF9FVkVOVFMsXG4gIENIQU5ORUxfU1RBVEVTLFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgUHVzaCBmcm9tIFwiLi9wdXNoXCJcbmltcG9ydCBUaW1lciBmcm9tIFwiLi90aW1lclwiXG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICogQHBhcmFtIHsoT2JqZWN0fGZ1bmN0aW9uKX0gcGFyYW1zXG4gKiBAcGFyYW0ge1NvY2tldH0gc29ja2V0XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENoYW5uZWwge1xuICBjb25zdHJ1Y3Rvcih0b3BpYywgcGFyYW1zLCBzb2NrZXQpe1xuICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5jbG9zZWRcbiAgICB0aGlzLnRvcGljID0gdG9waWNcbiAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUocGFyYW1zIHx8IHt9KVxuICAgIHRoaXMuc29ja2V0ID0gc29ja2V0XG4gICAgdGhpcy5iaW5kaW5ncyA9IFtdXG4gICAgdGhpcy5iaW5kaW5nUmVmID0gMFxuICAgIHRoaXMudGltZW91dCA9IHRoaXMuc29ja2V0LnRpbWVvdXRcbiAgICB0aGlzLmpvaW5lZE9uY2UgPSBmYWxzZVxuICAgIHRoaXMuam9pblB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5qb2luLCB0aGlzLnBhcmFtcywgdGhpcy50aW1lb3V0KVxuICAgIHRoaXMucHVzaEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5zdGF0ZUNoYW5nZVJlZnMgPSBbXVxuXG4gICAgdGhpcy5yZWpvaW5UaW1lciA9IG5ldyBUaW1lcigoKSA9PiB7XG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW4oKSB9XG4gICAgfSwgdGhpcy5zb2NrZXQucmVqb2luQWZ0ZXJNcylcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uRXJyb3IoKCkgPT4gdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpKSlcbiAgICB0aGlzLnN0YXRlQ2hhbmdlUmVmcy5wdXNoKHRoaXMuc29ja2V0Lm9uT3BlbigoKSA9PiB7XG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuaXNFcnJvcmVkKCkpeyB0aGlzLnJlam9pbigpIH1cbiAgICB9KVxuICAgIClcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuam9pbmVkXG4gICAgICB0aGlzLnJlam9pblRpbWVyLnJlc2V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5mb3JFYWNoKHB1c2hFdmVudCA9PiBwdXNoRXZlbnQuc2VuZCgpKVxuICAgICAgdGhpcy5wdXNoQnVmZmVyID0gW11cbiAgICB9KVxuICAgIHRoaXMuam9pblB1c2gucmVjZWl2ZShcImVycm9yXCIsICgpID0+IHtcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLm9uQ2xvc2UoKCkgPT4ge1xuICAgICAgdGhpcy5yZWpvaW5UaW1lci5yZXNldCgpXG4gICAgICBpZih0aGlzLnNvY2tldC5oYXNMb2dnZXIoKSkgdGhpcy5zb2NrZXQubG9nKFwiY2hhbm5lbFwiLCBgY2xvc2UgJHt0aGlzLnRvcGljfSAke3RoaXMuam9pblJlZigpfWApXG4gICAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkXG4gICAgICB0aGlzLnNvY2tldC5yZW1vdmUodGhpcylcbiAgICB9KVxuICAgIHRoaXMub25FcnJvcihyZWFzb24gPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGVycm9yICR7dGhpcy50b3BpY31gLCByZWFzb24pXG4gICAgICBpZih0aGlzLmlzSm9pbmluZygpKXsgdGhpcy5qb2luUHVzaC5yZXNldCgpIH1cbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICBpZih0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpKXsgdGhpcy5yZWpvaW5UaW1lci5zY2hlZHVsZVRpbWVvdXQoKSB9XG4gICAgfSlcbiAgICB0aGlzLmpvaW5QdXNoLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IHtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIGB0aW1lb3V0ICR7dGhpcy50b3BpY30gKCR7dGhpcy5qb2luUmVmKCl9KWAsIHRoaXMuam9pblB1c2gudGltZW91dClcbiAgICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRoaXMudGltZW91dClcbiAgICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICAgIHRoaXMuc3RhdGUgPSBDSEFOTkVMX1NUQVRFUy5lcnJvcmVkXG4gICAgICB0aGlzLmpvaW5QdXNoLnJlc2V0KClcbiAgICAgIGlmKHRoaXMuc29ja2V0LmlzQ29ubmVjdGVkKCkpeyB0aGlzLnJlam9pblRpbWVyLnNjaGVkdWxlVGltZW91dCgpIH1cbiAgICB9KVxuICAgIHRoaXMub24oQ0hBTk5FTF9FVkVOVFMucmVwbHksIChwYXlsb2FkLCByZWYpID0+IHtcbiAgICAgIHRoaXMudHJpZ2dlcih0aGlzLnJlcGx5RXZlbnROYW1lKHJlZiksIHBheWxvYWQpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBKb2luIHRoZSBjaGFubmVsXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGpvaW4odGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgaWYodGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcInRyaWVkIHRvIGpvaW4gbXVsdGlwbGUgdGltZXMuICdqb2luJyBjYW4gb25seSBiZSBjYWxsZWQgYSBzaW5nbGUgdGltZSBwZXIgY2hhbm5lbCBpbnN0YW5jZVwiKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgICB0aGlzLmpvaW5lZE9uY2UgPSB0cnVlXG4gICAgICB0aGlzLnJlam9pbigpXG4gICAgICByZXR1cm4gdGhpcy5qb2luUHVzaFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBIb29rIGludG8gY2hhbm5lbCBjbG9zZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25DbG9zZShjYWxsYmFjayl7XG4gICAgdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5jbG9zZSwgY2FsbGJhY2spXG4gIH1cblxuICAvKipcbiAgICogSG9vayBpbnRvIGNoYW5uZWwgZXJyb3JzXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbkVycm9yKGNhbGxiYWNrKXtcbiAgICByZXR1cm4gdGhpcy5vbihDSEFOTkVMX0VWRU5UUy5lcnJvciwgcmVhc29uID0+IGNhbGxiYWNrKHJlYXNvbikpXG4gIH1cblxuICAvKipcbiAgICogU3Vic2NyaWJlcyBvbiBjaGFubmVsIGV2ZW50c1xuICAgKlxuICAgKiBTdWJzY3JpcHRpb24gcmV0dXJucyBhIHJlZiBjb3VudGVyLCB3aGljaCBjYW4gYmUgdXNlZCBsYXRlciB0b1xuICAgKiB1bnN1YnNjcmliZSB0aGUgZXhhY3QgZXZlbnQgbGlzdGVuZXJcbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY29uc3QgcmVmMiA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19vdGhlcl9zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKiAvLyBTaW5jZSB1bnN1YnNjcmlwdGlvbiwgZG9fc3R1ZmYgd29uJ3QgZmlyZSxcbiAgICogLy8gd2hpbGUgZG9fb3RoZXJfc3R1ZmYgd2lsbCBrZWVwIGZpcmluZyBvbiB0aGUgXCJldmVudFwiXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKiBAcmV0dXJucyB7aW50ZWdlcn0gcmVmXG4gICAqL1xuICBvbihldmVudCwgY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLmJpbmRpbmdSZWYrK1xuICAgIHRoaXMuYmluZGluZ3MucHVzaCh7ZXZlbnQsIHJlZiwgY2FsbGJhY2t9KVxuICAgIHJldHVybiByZWZcbiAgfVxuXG4gIC8qKlxuICAgKiBVbnN1YnNjcmliZXMgb2ZmIG9mIGNoYW5uZWwgZXZlbnRzXG4gICAqXG4gICAqIFVzZSB0aGUgcmVmIHJldHVybmVkIGZyb20gYSBjaGFubmVsLm9uKCkgdG8gdW5zdWJzY3JpYmUgb25lXG4gICAqIGhhbmRsZXIsIG9yIHBhc3Mgbm90aGluZyBmb3IgdGhlIHJlZiB0byB1bnN1YnNjcmliZSBhbGxcbiAgICogaGFuZGxlcnMgZm9yIHRoZSBnaXZlbiBldmVudC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogLy8gVW5zdWJzY3JpYmUgdGhlIGRvX3N0dWZmIGhhbmRsZXJcbiAgICogY29uc3QgcmVmMSA9IGNoYW5uZWwub24oXCJldmVudFwiLCBkb19zdHVmZilcbiAgICogY2hhbm5lbC5vZmYoXCJldmVudFwiLCByZWYxKVxuICAgKlxuICAgKiAvLyBVbnN1YnNjcmliZSBhbGwgaGFuZGxlcnMgZnJvbSBldmVudFxuICAgKiBjaGFubmVsLm9mZihcImV2ZW50XCIpXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IHJlZlxuICAgKi9cbiAgb2ZmKGV2ZW50LCByZWYpe1xuICAgIHRoaXMuYmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcigoYmluZCkgPT4ge1xuICAgICAgcmV0dXJuICEoYmluZC5ldmVudCA9PT0gZXZlbnQgJiYgKHR5cGVvZiByZWYgPT09IFwidW5kZWZpbmVkXCIgfHwgcmVmID09PSBiaW5kLnJlZikpXG4gICAgfSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgY2FuUHVzaCgpeyByZXR1cm4gdGhpcy5zb2NrZXQuaXNDb25uZWN0ZWQoKSAmJiB0aGlzLmlzSm9pbmVkKCkgfVxuXG4gIC8qKlxuICAgKiBTZW5kcyBhIG1lc3NhZ2UgYGV2ZW50YCB0byBwaG9lbml4IHdpdGggdGhlIHBheWxvYWQgYHBheWxvYWRgLlxuICAgKiBQaG9lbml4IHJlY2VpdmVzIHRoaXMgaW4gdGhlIGBoYW5kbGVfaW4oZXZlbnQsIHBheWxvYWQsIHNvY2tldClgXG4gICAqIGZ1bmN0aW9uLiBpZiBwaG9lbml4IHJlcGxpZXMgb3IgaXQgdGltZXMgb3V0IChkZWZhdWx0IDEwMDAwbXMpLFxuICAgKiB0aGVuIG9wdGlvbmFsbHkgdGhlIHJlcGx5IGNhbiBiZSByZWNlaXZlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogY2hhbm5lbC5wdXNoKFwiZXZlbnRcIilcbiAgICogICAucmVjZWl2ZShcIm9rXCIsIHBheWxvYWQgPT4gY29uc29sZS5sb2coXCJwaG9lbml4IHJlcGxpZWQ6XCIsIHBheWxvYWQpKVxuICAgKiAgIC5yZWNlaXZlKFwiZXJyb3JcIiwgZXJyID0+IGNvbnNvbGUubG9nKFwicGhvZW5peCBlcnJvcmVkXCIsIGVycikpXG4gICAqICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+IGNvbnNvbGUubG9nKFwidGltZWQgb3V0IHB1c2hpbmdcIikpXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBldmVudFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGF5bG9hZFxuICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWVvdXRdXG4gICAqIEByZXR1cm5zIHtQdXNofVxuICAgKi9cbiAgcHVzaChldmVudCwgcGF5bG9hZCwgdGltZW91dCA9IHRoaXMudGltZW91dCl7XG4gICAgcGF5bG9hZCA9IHBheWxvYWQgfHwge31cbiAgICBpZighdGhpcy5qb2luZWRPbmNlKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgdHJpZWQgdG8gcHVzaCAnJHtldmVudH0nIHRvICcke3RoaXMudG9waWN9JyBiZWZvcmUgam9pbmluZy4gVXNlIGNoYW5uZWwuam9pbigpIGJlZm9yZSBwdXNoaW5nIGV2ZW50c2ApXG4gICAgfVxuICAgIGxldCBwdXNoRXZlbnQgPSBuZXcgUHVzaCh0aGlzLCBldmVudCwgZnVuY3Rpb24gKCl7IHJldHVybiBwYXlsb2FkIH0sIHRpbWVvdXQpXG4gICAgaWYodGhpcy5jYW5QdXNoKCkpe1xuICAgICAgcHVzaEV2ZW50LnNlbmQoKVxuICAgIH0gZWxzZSB7XG4gICAgICBwdXNoRXZlbnQuc3RhcnRUaW1lb3V0KClcbiAgICAgIHRoaXMucHVzaEJ1ZmZlci5wdXNoKHB1c2hFdmVudClcbiAgICB9XG5cbiAgICByZXR1cm4gcHVzaEV2ZW50XG4gIH1cblxuICAvKiogTGVhdmVzIHRoZSBjaGFubmVsXG4gICAqXG4gICAqIFVuc3Vic2NyaWJlcyBmcm9tIHNlcnZlciBldmVudHMsIGFuZFxuICAgKiBpbnN0cnVjdHMgY2hhbm5lbCB0byB0ZXJtaW5hdGUgb24gc2VydmVyXG4gICAqXG4gICAqIFRyaWdnZXJzIG9uQ2xvc2UoKSBob29rc1xuICAgKlxuICAgKiBUbyByZWNlaXZlIGxlYXZlIGFja25vd2xlZGdlbWVudHMsIHVzZSB0aGUgYHJlY2VpdmVgXG4gICAqIGhvb2sgdG8gYmluZCB0byB0aGUgc2VydmVyIGFjaywgaWU6XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIGNoYW5uZWwubGVhdmUoKS5yZWNlaXZlKFwib2tcIiwgKCkgPT4gYWxlcnQoXCJsZWZ0IVwiKSApXG4gICAqXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gdGltZW91dFxuICAgKiBAcmV0dXJucyB7UHVzaH1cbiAgICovXG4gIGxlYXZlKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIHRoaXMucmVqb2luVGltZXIucmVzZXQoKVxuICAgIHRoaXMuam9pblB1c2guY2FuY2VsVGltZW91dCgpXG5cbiAgICB0aGlzLnN0YXRlID0gQ0hBTk5FTF9TVEFURVMubGVhdmluZ1xuICAgIGxldCBvbkNsb3NlID0gKCkgPT4ge1xuICAgICAgaWYodGhpcy5zb2NrZXQuaGFzTG9nZ2VyKCkpIHRoaXMuc29ja2V0LmxvZyhcImNoYW5uZWxcIiwgYGxlYXZlICR7dGhpcy50b3BpY31gKVxuICAgICAgdGhpcy50cmlnZ2VyKENIQU5ORUxfRVZFTlRTLmNsb3NlLCBcImxlYXZlXCIpXG4gICAgfVxuICAgIGxldCBsZWF2ZVB1c2ggPSBuZXcgUHVzaCh0aGlzLCBDSEFOTkVMX0VWRU5UUy5sZWF2ZSwgY2xvc3VyZSh7fSksIHRpbWVvdXQpXG4gICAgbGVhdmVQdXNoLnJlY2VpdmUoXCJva1wiLCAoKSA9PiBvbkNsb3NlKCkpXG4gICAgICAucmVjZWl2ZShcInRpbWVvdXRcIiwgKCkgPT4gb25DbG9zZSgpKVxuICAgIGxlYXZlUHVzaC5zZW5kKClcbiAgICBpZighdGhpcy5jYW5QdXNoKCkpeyBsZWF2ZVB1c2gudHJpZ2dlcihcIm9rXCIsIHt9KSB9XG5cbiAgICByZXR1cm4gbGVhdmVQdXNoXG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGFibGUgbWVzc2FnZSBob29rXG4gICAqXG4gICAqIFJlY2VpdmVzIGFsbCBldmVudHMgZm9yIHNwZWNpYWxpemVkIG1lc3NhZ2UgaGFuZGxpbmdcbiAgICogYmVmb3JlIGRpc3BhdGNoaW5nIHRvIHRoZSBjaGFubmVsIGNhbGxiYWNrcy5cbiAgICpcbiAgICogTXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcbiAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50XG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXlsb2FkXG4gICAqIEBwYXJhbSB7aW50ZWdlcn0gcmVmXG4gICAqIEByZXR1cm5zIHtPYmplY3R9XG4gICAqL1xuICBvbk1lc3NhZ2UoX2V2ZW50LCBwYXlsb2FkLCBfcmVmKXsgcmV0dXJuIHBheWxvYWQgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmKXtcbiAgICBpZih0aGlzLnRvcGljICE9PSB0b3BpYyl7IHJldHVybiBmYWxzZSB9XG5cbiAgICBpZihqb2luUmVmICYmIGpvaW5SZWYgIT09IHRoaXMuam9pblJlZigpKXtcbiAgICAgIGlmKHRoaXMuc29ja2V0Lmhhc0xvZ2dlcigpKSB0aGlzLnNvY2tldC5sb2coXCJjaGFubmVsXCIsIFwiZHJvcHBpbmcgb3V0ZGF0ZWQgbWVzc2FnZVwiLCB7dG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luUmVmfSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgam9pblJlZigpeyByZXR1cm4gdGhpcy5qb2luUHVzaC5yZWYgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcmVqb2luKHRpbWVvdXQgPSB0aGlzLnRpbWVvdXQpe1xuICAgIGlmKHRoaXMuaXNMZWF2aW5nKCkpeyByZXR1cm4gfVxuICAgIHRoaXMuc29ja2V0LmxlYXZlT3BlblRvcGljKHRoaXMudG9waWMpXG4gICAgdGhpcy5zdGF0ZSA9IENIQU5ORUxfU1RBVEVTLmpvaW5pbmdcbiAgICB0aGlzLmpvaW5QdXNoLnJlc2VuZCh0aW1lb3V0KVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpe1xuICAgIGxldCBoYW5kbGVkUGF5bG9hZCA9IHRoaXMub25NZXNzYWdlKGV2ZW50LCBwYXlsb2FkLCByZWYsIGpvaW5SZWYpXG4gICAgaWYocGF5bG9hZCAmJiAhaGFuZGxlZFBheWxvYWQpeyB0aHJvdyBuZXcgRXJyb3IoXCJjaGFubmVsIG9uTWVzc2FnZSBjYWxsYmFja3MgbXVzdCByZXR1cm4gdGhlIHBheWxvYWQsIG1vZGlmaWVkIG9yIHVubW9kaWZpZWRcIikgfVxuXG4gICAgbGV0IGV2ZW50QmluZGluZ3MgPSB0aGlzLmJpbmRpbmdzLmZpbHRlcihiaW5kID0+IGJpbmQuZXZlbnQgPT09IGV2ZW50KVxuXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGV2ZW50QmluZGluZ3MubGVuZ3RoOyBpKyspe1xuICAgICAgbGV0IGJpbmQgPSBldmVudEJpbmRpbmdzW2ldXG4gICAgICBiaW5kLmNhbGxiYWNrKGhhbmRsZWRQYXlsb2FkLCByZWYsIGpvaW5SZWYgfHwgdGhpcy5qb2luUmVmKCkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICByZXBseUV2ZW50TmFtZShyZWYpeyByZXR1cm4gYGNoYW5fcmVwbHlfJHtyZWZ9YCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0Nsb3NlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuY2xvc2VkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzRXJyb3JlZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuZXJyb3JlZCB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0pvaW5lZCgpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmVkIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICovXG4gIGlzSm9pbmluZygpeyByZXR1cm4gdGhpcy5zdGF0ZSA9PT0gQ0hBTk5FTF9TVEFURVMuam9pbmluZyB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBpc0xlYXZpbmcoKXsgcmV0dXJuIHRoaXMuc3RhdGUgPT09IENIQU5ORUxfU1RBVEVTLmxlYXZpbmcgfVxufVxuIiwgImltcG9ydCB7XG4gIGdsb2JhbCxcbiAgWEhSX1NUQVRFU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBamF4IHtcblxuICBzdGF0aWMgcmVxdWVzdChtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIGlmKGdsb2JhbC5YRG9tYWluUmVxdWVzdCl7XG4gICAgICBsZXQgcmVxID0gbmV3IGdsb2JhbC5YRG9tYWluUmVxdWVzdCgpIC8vIElFOCwgSUU5XG4gICAgICByZXR1cm4gdGhpcy54ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByZXEgPSBuZXcgZ2xvYmFsLlhNTEh0dHBSZXF1ZXN0KCkgLy8gSUU3KywgRmlyZWZveCwgQ2hyb21lLCBPcGVyYSwgU2FmYXJpXG4gICAgICByZXR1cm4gdGhpcy54aHJSZXF1ZXN0KHJlcSwgbWV0aG9kLCBlbmRQb2ludCwgYWNjZXB0LCBib2R5LCB0aW1lb3V0LCBvbnRpbWVvdXQsIGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyB4ZG9tYWluUmVxdWVzdChyZXEsIG1ldGhvZCwgZW5kUG9pbnQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS50aW1lb3V0ID0gdGltZW91dFxuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQpXG4gICAgcmVxLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgIGxldCByZXNwb25zZSA9IHRoaXMucGFyc2VKU09OKHJlcS5yZXNwb25zZVRleHQpXG4gICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwb25zZSlcbiAgICB9XG4gICAgaWYob250aW1lb3V0KXsgcmVxLm9udGltZW91dCA9IG9udGltZW91dCB9XG5cbiAgICAvLyBXb3JrIGFyb3VuZCBidWcgaW4gSUU5IHRoYXQgcmVxdWlyZXMgYW4gYXR0YWNoZWQgb25wcm9ncmVzcyBoYW5kbGVyXG4gICAgcmVxLm9ucHJvZ3Jlc3MgPSAoKSA9PiB7IH1cblxuICAgIHJlcS5zZW5kKGJvZHkpXG4gICAgcmV0dXJuIHJlcVxuICB9XG5cbiAgc3RhdGljIHhoclJlcXVlc3QocmVxLCBtZXRob2QsIGVuZFBvaW50LCBhY2NlcHQsIGJvZHksIHRpbWVvdXQsIG9udGltZW91dCwgY2FsbGJhY2spe1xuICAgIHJlcS5vcGVuKG1ldGhvZCwgZW5kUG9pbnQsIHRydWUpXG4gICAgcmVxLnRpbWVvdXQgPSB0aW1lb3V0XG4gICAgcmVxLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LVR5cGVcIiwgYWNjZXB0KVxuICAgIHJlcS5vbmVycm9yID0gKCkgPT4gY2FsbGJhY2sgJiYgY2FsbGJhY2sobnVsbClcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gKCkgPT4ge1xuICAgICAgaWYocmVxLnJlYWR5U3RhdGUgPT09IFhIUl9TVEFURVMuY29tcGxldGUgJiYgY2FsbGJhY2spe1xuICAgICAgICBsZXQgcmVzcG9uc2UgPSB0aGlzLnBhcnNlSlNPTihyZXEucmVzcG9uc2VUZXh0KVxuICAgICAgICBjYWxsYmFjayhyZXNwb25zZSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYob250aW1lb3V0KXsgcmVxLm9udGltZW91dCA9IG9udGltZW91dCB9XG5cbiAgICByZXEuc2VuZChib2R5KVxuICAgIHJldHVybiByZXFcbiAgfVxuXG4gIHN0YXRpYyBwYXJzZUpTT04ocmVzcCl7XG4gICAgaWYoIXJlc3AgfHwgcmVzcCA9PT0gXCJcIil7IHJldHVybiBudWxsIH1cblxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShyZXNwKVxuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgY29uc29sZSAmJiBjb25zb2xlLmxvZyhcImZhaWxlZCB0byBwYXJzZSBKU09OIHJlc3BvbnNlXCIsIHJlc3ApXG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemUob2JqLCBwYXJlbnRLZXkpe1xuICAgIGxldCBxdWVyeVN0ciA9IFtdXG4gICAgZm9yKHZhciBrZXkgaW4gb2JqKXtcbiAgICAgIGlmKCFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBrZXkpKXsgY29udGludWUgfVxuICAgICAgbGV0IHBhcmFtS2V5ID0gcGFyZW50S2V5ID8gYCR7cGFyZW50S2V5fVske2tleX1dYCA6IGtleVxuICAgICAgbGV0IHBhcmFtVmFsID0gb2JqW2tleV1cbiAgICAgIGlmKHR5cGVvZiBwYXJhbVZhbCA9PT0gXCJvYmplY3RcIil7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2godGhpcy5zZXJpYWxpemUocGFyYW1WYWwsIHBhcmFtS2V5KSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXJ5U3RyLnB1c2goZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtS2V5KSArIFwiPVwiICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtVmFsKSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5U3RyLmpvaW4oXCImXCIpXG4gIH1cblxuICBzdGF0aWMgYXBwZW5kUGFyYW1zKHVybCwgcGFyYW1zKXtcbiAgICBpZihPYmplY3Qua2V5cyhwYXJhbXMpLmxlbmd0aCA9PT0gMCl7IHJldHVybiB1cmwgfVxuXG4gICAgbGV0IHByZWZpeCA9IHVybC5tYXRjaCgvXFw/LykgPyBcIiZcIiA6IFwiP1wiXG4gICAgcmV0dXJuIGAke3VybH0ke3ByZWZpeH0ke3RoaXMuc2VyaWFsaXplKHBhcmFtcyl9YFxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgU09DS0VUX1NUQVRFUyxcbiAgVFJBTlNQT1JUU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQgQWpheCBmcm9tIFwiLi9hamF4XCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTG9uZ1BvbGwge1xuXG4gIGNvbnN0cnVjdG9yKGVuZFBvaW50KXtcbiAgICB0aGlzLmVuZFBvaW50ID0gbnVsbFxuICAgIHRoaXMudG9rZW4gPSBudWxsXG4gICAgdGhpcy5za2lwSGVhcnRiZWF0ID0gdHJ1ZVxuICAgIHRoaXMucmVxcyA9IG5ldyBTZXQoKVxuICAgIHRoaXMub25vcGVuID0gZnVuY3Rpb24gKCl7IH0gLy8gbm9vcFxuICAgIHRoaXMub25lcnJvciA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICB0aGlzLm9uY2xvc2UgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgdGhpcy5wb2xsRW5kcG9pbnQgPSB0aGlzLm5vcm1hbGl6ZUVuZHBvaW50KGVuZFBvaW50KVxuICAgIHRoaXMucmVhZHlTdGF0ZSA9IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZ1xuICAgIHRoaXMucG9sbCgpXG4gIH1cblxuICBub3JtYWxpemVFbmRwb2ludChlbmRQb2ludCl7XG4gICAgcmV0dXJuIChlbmRQb2ludFxuICAgICAgLnJlcGxhY2UoXCJ3czovL1wiLCBcImh0dHA6Ly9cIilcbiAgICAgIC5yZXBsYWNlKFwid3NzOi8vXCIsIFwiaHR0cHM6Ly9cIilcbiAgICAgIC5yZXBsYWNlKG5ldyBSZWdFeHAoXCIoLiopXFwvXCIgKyBUUkFOU1BPUlRTLndlYnNvY2tldCksIFwiJDEvXCIgKyBUUkFOU1BPUlRTLmxvbmdwb2xsKSlcbiAgfVxuXG4gIGVuZHBvaW50VVJMKCl7XG4gICAgcmV0dXJuIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMucG9sbEVuZHBvaW50LCB7dG9rZW46IHRoaXMudG9rZW59KVxuICB9XG5cbiAgY2xvc2VBbmRSZXRyeShjb2RlLCByZWFzb24sIHdhc0NsZWFuKXtcbiAgICB0aGlzLmNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pXG4gICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nXG4gIH1cblxuICBvbnRpbWVvdXQoKXtcbiAgICB0aGlzLm9uZXJyb3IoXCJ0aW1lb3V0XCIpXG4gICAgdGhpcy5jbG9zZUFuZFJldHJ5KDEwMDUsIFwidGltZW91dFwiLCBmYWxzZSlcbiAgfVxuXG4gIGlzQWN0aXZlKCl7IHJldHVybiB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMub3BlbiB8fCB0aGlzLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY29ubmVjdGluZyB9XG5cbiAgcG9sbCgpe1xuICAgIHRoaXMuYWpheChcIkdFVFwiLCBudWxsLCAoKSA9PiB0aGlzLm9udGltZW91dCgpLCByZXNwID0+IHtcbiAgICAgIGlmKHJlc3Ape1xuICAgICAgICB2YXIge3N0YXR1cywgdG9rZW4sIG1lc3NhZ2VzfSA9IHJlc3BcbiAgICAgICAgdGhpcy50b2tlbiA9IHRva2VuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0dXMgPSAwXG4gICAgICB9XG5cbiAgICAgIHN3aXRjaChzdGF0dXMpe1xuICAgICAgICBjYXNlIDIwMDpcbiAgICAgICAgICBtZXNzYWdlcy5mb3JFYWNoKG1zZyA9PiB7XG4gICAgICAgICAgICAvLyBUYXNrcyBhcmUgd2hhdCB0aGluZ3MgbGlrZSBldmVudCBoYW5kbGVycywgc2V0VGltZW91dCBjYWxsYmFja3MsXG4gICAgICAgICAgICAvLyBwcm9taXNlIHJlc29sdmVzIGFuZCBtb3JlIGFyZSBydW4gd2l0aGluLlxuICAgICAgICAgICAgLy8gSW4gbW9kZXJuIGJyb3dzZXJzLCB0aGVyZSBhcmUgdHdvIGRpZmZlcmVudCBraW5kcyBvZiB0YXNrcyxcbiAgICAgICAgICAgIC8vIG1pY3JvdGFza3MgYW5kIG1hY3JvdGFza3MuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFyZSBtYWlubHkgdXNlZCBmb3IgUHJvbWlzZXMsIHdoaWxlIG1hY3JvdGFza3MgYXJlXG4gICAgICAgICAgICAvLyB1c2VkIGZvciBldmVyeXRoaW5nIGVsc2UuXG4gICAgICAgICAgICAvLyBNaWNyb3Rhc2tzIGFsd2F5cyBoYXZlIHByaW9yaXR5IG92ZXIgbWFjcm90YXNrcy4gSWYgdGhlIEpTIGVuZ2luZVxuICAgICAgICAgICAgLy8gaXMgbG9va2luZyBmb3IgYSB0YXNrIHRvIHJ1biwgaXQgd2lsbCBhbHdheXMgdHJ5IHRvIGVtcHR5IHRoZVxuICAgICAgICAgICAgLy8gbWljcm90YXNrIHF1ZXVlIGJlZm9yZSBhdHRlbXB0aW5nIHRvIHJ1biBhbnl0aGluZyBmcm9tIHRoZVxuICAgICAgICAgICAgLy8gbWFjcm90YXNrIHF1ZXVlLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEZvciB0aGUgV2ViU29ja2V0IHRyYW5zcG9ydCwgbWVzc2FnZXMgYWx3YXlzIGFycml2ZSBpbiB0aGVpciBvd25cbiAgICAgICAgICAgIC8vIGV2ZW50LiBUaGlzIG1lYW5zIHRoYXQgaWYgYW55IHByb21pc2VzIGFyZSByZXNvbHZlZCBmcm9tIHdpdGhpbixcbiAgICAgICAgICAgIC8vIHRoZWlyIGNhbGxiYWNrcyB3aWxsIGFsd2F5cyBmaW5pc2ggZXhlY3V0aW9uIGJ5IHRoZSB0aW1lIHRoZVxuICAgICAgICAgICAgLy8gbmV4dCBtZXNzYWdlIGV2ZW50IGhhbmRsZXIgaXMgcnVuLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEluIG9yZGVyIHRvIGVtdWxhdGUgdGhpcyBiZWhhdmlvdXIsIHdlIG5lZWQgdG8gbWFrZSBzdXJlIGVhY2hcbiAgICAgICAgICAgIC8vIG9ubWVzc2FnZSBoYW5kbGVyIGlzIHJ1biB3aXRoaW4gaXQncyBvd24gbWFjcm90YXNrLlxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLm9ubWVzc2FnZSh7ZGF0YTogbXNnfSksIDApXG4gICAgICAgICAgfSlcbiAgICAgICAgICB0aGlzLnBvbGwoKVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjA0OlxuICAgICAgICAgIHRoaXMucG9sbCgpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0MTA6XG4gICAgICAgICAgdGhpcy5yZWFkeVN0YXRlID0gU09DS0VUX1NUQVRFUy5vcGVuXG4gICAgICAgICAgdGhpcy5vbm9wZW4oe30pXG4gICAgICAgICAgdGhpcy5wb2xsKClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlIDQwMzpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNDAzKVxuICAgICAgICAgIHRoaXMuY2xvc2UoMTAwOCwgXCJmb3JiaWRkZW5cIiwgZmFsc2UpXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICBjYXNlIDUwMDpcbiAgICAgICAgICB0aGlzLm9uZXJyb3IoNTAwKVxuICAgICAgICAgIHRoaXMuY2xvc2VBbmRSZXRyeSgxMDExLCBcImludGVybmFsIHNlcnZlciBlcnJvclwiLCA1MDApXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDogdGhyb3cgbmV3IEVycm9yKGB1bmhhbmRsZWQgcG9sbCBzdGF0dXMgJHtzdGF0dXN9YClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgc2VuZChib2R5KXtcbiAgICB0aGlzLmFqYXgoXCJQT1NUXCIsIGJvZHksICgpID0+IHRoaXMub25lcnJvcihcInRpbWVvdXRcIiksIHJlc3AgPT4ge1xuICAgICAgaWYoIXJlc3AgfHwgcmVzcC5zdGF0dXMgIT09IDIwMCl7XG4gICAgICAgIHRoaXMub25lcnJvcihyZXNwICYmIHJlc3Auc3RhdHVzKVxuICAgICAgICB0aGlzLmNsb3NlQW5kUmV0cnkoMTAxMSwgXCJpbnRlcm5hbCBzZXJ2ZXIgZXJyb3JcIiwgZmFsc2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNsb3NlKGNvZGUsIHJlYXNvbiwgd2FzQ2xlYW4pe1xuICAgIGZvcihsZXQgcmVxIG9mIHRoaXMucmVxcyl7IHJlcS5hYm9ydCgpIH1cbiAgICB0aGlzLnJlYWR5U3RhdGUgPSBTT0NLRVRfU1RBVEVTLmNsb3NlZFxuICAgIGxldCBvcHRzID0gT2JqZWN0LmFzc2lnbih7Y29kZTogMTAwMCwgcmVhc29uOiB1bmRlZmluZWQsIHdhc0NsZWFuOiB0cnVlfSwge2NvZGUsIHJlYXNvbiwgd2FzQ2xlYW59KVxuICAgIGlmKHR5cGVvZihDbG9zZUV2ZW50KSAhPT0gXCJ1bmRlZmluZWRcIil7XG4gICAgICB0aGlzLm9uY2xvc2UobmV3IENsb3NlRXZlbnQoXCJjbG9zZVwiLCBvcHRzKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vbmNsb3NlKG9wdHMpXG4gICAgfVxuICB9XG5cbiAgYWpheChtZXRob2QsIGJvZHksIG9uQ2FsbGVyVGltZW91dCwgY2FsbGJhY2spe1xuICAgIGxldCByZXFcbiAgICBsZXQgb250aW1lb3V0ID0gKCkgPT4ge1xuICAgICAgdGhpcy5yZXFzLmRlbGV0ZShyZXEpXG4gICAgICBvbkNhbGxlclRpbWVvdXQoKVxuICAgIH1cbiAgICByZXEgPSBBamF4LnJlcXVlc3QobWV0aG9kLCB0aGlzLmVuZHBvaW50VVJMKCksIFwiYXBwbGljYXRpb24vanNvblwiLCBib2R5LCB0aGlzLnRpbWVvdXQsIG9udGltZW91dCwgcmVzcCA9PiB7XG4gICAgICB0aGlzLnJlcXMuZGVsZXRlKHJlcSlcbiAgICAgIGlmKHRoaXMuaXNBY3RpdmUoKSl7IGNhbGxiYWNrKHJlc3ApIH1cbiAgICB9KVxuICAgIHRoaXMucmVxcy5hZGQocmVxKVxuICB9XG59XG4iLCAiLyoqXG4gKiBJbml0aWFsaXplcyB0aGUgUHJlc2VuY2VcbiAqIEBwYXJhbSB7Q2hhbm5lbH0gY2hhbm5lbCAtIFRoZSBDaGFubmVsXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyAtIFRoZSBvcHRpb25zLFxuICogICAgICAgIGZvciBleGFtcGxlIGB7ZXZlbnRzOiB7c3RhdGU6IFwic3RhdGVcIiwgZGlmZjogXCJkaWZmXCJ9fWBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUHJlc2VuY2Uge1xuXG4gIGNvbnN0cnVjdG9yKGNoYW5uZWwsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGV2ZW50cyA9IG9wdHMuZXZlbnRzIHx8IHtzdGF0ZTogXCJwcmVzZW5jZV9zdGF0ZVwiLCBkaWZmOiBcInByZXNlbmNlX2RpZmZcIn1cbiAgICB0aGlzLnN0YXRlID0ge31cbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgdGhpcy5jaGFubmVsID0gY2hhbm5lbFxuICAgIHRoaXMuam9pblJlZiA9IG51bGxcbiAgICB0aGlzLmNhbGxlciA9IHtcbiAgICAgIG9uSm9pbjogZnVuY3Rpb24gKCl7IH0sXG4gICAgICBvbkxlYXZlOiBmdW5jdGlvbiAoKXsgfSxcbiAgICAgIG9uU3luYzogZnVuY3Rpb24gKCl7IH1cbiAgICB9XG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLnN0YXRlLCBuZXdTdGF0ZSA9PiB7XG4gICAgICBsZXQge29uSm9pbiwgb25MZWF2ZSwgb25TeW5jfSA9IHRoaXMuY2FsbGVyXG5cbiAgICAgIHRoaXMuam9pblJlZiA9IHRoaXMuY2hhbm5lbC5qb2luUmVmKClcbiAgICAgIHRoaXMuc3RhdGUgPSBQcmVzZW5jZS5zeW5jU3RhdGUodGhpcy5zdGF0ZSwgbmV3U3RhdGUsIG9uSm9pbiwgb25MZWF2ZSlcblxuICAgICAgdGhpcy5wZW5kaW5nRGlmZnMuZm9yRWFjaChkaWZmID0+IHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gICAgICBvblN5bmMoKVxuICAgIH0pXG5cbiAgICB0aGlzLmNoYW5uZWwub24oZXZlbnRzLmRpZmYsIGRpZmYgPT4ge1xuICAgICAgbGV0IHtvbkpvaW4sIG9uTGVhdmUsIG9uU3luY30gPSB0aGlzLmNhbGxlclxuXG4gICAgICBpZih0aGlzLmluUGVuZGluZ1N5bmNTdGF0ZSgpKXtcbiAgICAgICAgdGhpcy5wZW5kaW5nRGlmZnMucHVzaChkaWZmKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFByZXNlbmNlLnN5bmNEaWZmKHRoaXMuc3RhdGUsIGRpZmYsIG9uSm9pbiwgb25MZWF2ZSlcbiAgICAgICAgb25TeW5jKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgb25Kb2luKGNhbGxiYWNrKXsgdGhpcy5jYWxsZXIub25Kb2luID0gY2FsbGJhY2sgfVxuXG4gIG9uTGVhdmUoY2FsbGJhY2speyB0aGlzLmNhbGxlci5vbkxlYXZlID0gY2FsbGJhY2sgfVxuXG4gIG9uU3luYyhjYWxsYmFjayl7IHRoaXMuY2FsbGVyLm9uU3luYyA9IGNhbGxiYWNrIH1cblxuICBsaXN0KGJ5KXsgcmV0dXJuIFByZXNlbmNlLmxpc3QodGhpcy5zdGF0ZSwgYnkpIH1cblxuICBpblBlbmRpbmdTeW5jU3RhdGUoKXtcbiAgICByZXR1cm4gIXRoaXMuam9pblJlZiB8fCAodGhpcy5qb2luUmVmICE9PSB0aGlzLmNoYW5uZWwuam9pblJlZigpKVxuICB9XG5cbiAgLy8gbG93ZXItbGV2ZWwgcHVibGljIHN0YXRpYyBBUElcblxuICAvKipcbiAgICogVXNlZCB0byBzeW5jIHRoZSBsaXN0IG9mIHByZXNlbmNlcyBvbiB0aGUgc2VydmVyXG4gICAqIHdpdGggdGhlIGNsaWVudCdzIHN0YXRlLiBBbiBvcHRpb25hbCBgb25Kb2luYCBhbmQgYG9uTGVhdmVgIGNhbGxiYWNrIGNhblxuICAgKiBiZSBwcm92aWRlZCB0byByZWFjdCB0byBjaGFuZ2VzIGluIHRoZSBjbGllbnQncyBsb2NhbCBwcmVzZW5jZXMgYWNyb3NzXG4gICAqIGRpc2Nvbm5lY3RzIGFuZCByZWNvbm5lY3RzIHdpdGggdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNTdGF0ZShjdXJyZW50U3RhdGUsIG5ld1N0YXRlLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCBzdGF0ZSA9IHRoaXMuY2xvbmUoY3VycmVudFN0YXRlKVxuICAgIGxldCBqb2lucyA9IHt9XG4gICAgbGV0IGxlYXZlcyA9IHt9XG5cbiAgICB0aGlzLm1hcChzdGF0ZSwgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIGlmKCFuZXdTdGF0ZVtrZXldKXtcbiAgICAgICAgbGVhdmVzW2tleV0gPSBwcmVzZW5jZVxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5tYXAobmV3U3RhdGUsIChrZXksIG5ld1ByZXNlbmNlKSA9PiB7XG4gICAgICBsZXQgY3VycmVudFByZXNlbmNlID0gc3RhdGVba2V5XVxuICAgICAgaWYoY3VycmVudFByZXNlbmNlKXtcbiAgICAgICAgbGV0IG5ld1JlZnMgPSBuZXdQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJSZWZzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLm1hcChtID0+IG0ucGh4X3JlZilcbiAgICAgICAgbGV0IGpvaW5lZE1ldGFzID0gbmV3UHJlc2VuY2UubWV0YXMuZmlsdGVyKG0gPT4gY3VyUmVmcy5pbmRleE9mKG0ucGh4X3JlZikgPCAwKVxuICAgICAgICBsZXQgbGVmdE1ldGFzID0gY3VycmVudFByZXNlbmNlLm1ldGFzLmZpbHRlcihtID0+IG5ld1JlZnMuaW5kZXhPZihtLnBoeF9yZWYpIDwgMClcbiAgICAgICAgaWYoam9pbmVkTWV0YXMubGVuZ3RoID4gMCl7XG4gICAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICAgICAgam9pbnNba2V5XS5tZXRhcyA9IGpvaW5lZE1ldGFzXG4gICAgICAgIH1cbiAgICAgICAgaWYobGVmdE1ldGFzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxlYXZlc1trZXldID0gdGhpcy5jbG9uZShjdXJyZW50UHJlc2VuY2UpXG4gICAgICAgICAgbGVhdmVzW2tleV0ubWV0YXMgPSBsZWZ0TWV0YXNcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgam9pbnNba2V5XSA9IG5ld1ByZXNlbmNlXG4gICAgICB9XG4gICAgfSlcbiAgICByZXR1cm4gdGhpcy5zeW5jRGlmZihzdGF0ZSwge2pvaW5zOiBqb2lucywgbGVhdmVzOiBsZWF2ZXN9LCBvbkpvaW4sIG9uTGVhdmUpXG4gIH1cblxuICAvKipcbiAgICpcbiAgICogVXNlZCB0byBzeW5jIGEgZGlmZiBvZiBwcmVzZW5jZSBqb2luIGFuZCBsZWF2ZVxuICAgKiBldmVudHMgZnJvbSB0aGUgc2VydmVyLCBhcyB0aGV5IGhhcHBlbi4gTGlrZSBgc3luY1N0YXRlYCwgYHN5bmNEaWZmYFxuICAgKiBhY2NlcHRzIG9wdGlvbmFsIGBvbkpvaW5gIGFuZCBgb25MZWF2ZWAgY2FsbGJhY2tzIHRvIHJlYWN0IHRvIGEgdXNlclxuICAgKiBqb2luaW5nIG9yIGxlYXZpbmcgZnJvbSBhIGRldmljZS5cbiAgICpcbiAgICogQHJldHVybnMge1ByZXNlbmNlfVxuICAgKi9cbiAgc3RhdGljIHN5bmNEaWZmKHN0YXRlLCBkaWZmLCBvbkpvaW4sIG9uTGVhdmUpe1xuICAgIGxldCB7am9pbnMsIGxlYXZlc30gPSB0aGlzLmNsb25lKGRpZmYpXG4gICAgaWYoIW9uSm9pbil7IG9uSm9pbiA9IGZ1bmN0aW9uICgpeyB9IH1cbiAgICBpZighb25MZWF2ZSl7IG9uTGVhdmUgPSBmdW5jdGlvbiAoKXsgfSB9XG5cbiAgICB0aGlzLm1hcChqb2lucywgKGtleSwgbmV3UHJlc2VuY2UpID0+IHtcbiAgICAgIGxldCBjdXJyZW50UHJlc2VuY2UgPSBzdGF0ZVtrZXldXG4gICAgICBzdGF0ZVtrZXldID0gdGhpcy5jbG9uZShuZXdQcmVzZW5jZSlcbiAgICAgIGlmKGN1cnJlbnRQcmVzZW5jZSl7XG4gICAgICAgIGxldCBqb2luZWRSZWZzID0gc3RhdGVba2V5XS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICAgIGxldCBjdXJNZXRhcyA9IGN1cnJlbnRQcmVzZW5jZS5tZXRhcy5maWx0ZXIobSA9PiBqb2luZWRSZWZzLmluZGV4T2YobS5waHhfcmVmKSA8IDApXG4gICAgICAgIHN0YXRlW2tleV0ubWV0YXMudW5zaGlmdCguLi5jdXJNZXRhcylcbiAgICAgIH1cbiAgICAgIG9uSm9pbihrZXksIGN1cnJlbnRQcmVzZW5jZSwgbmV3UHJlc2VuY2UpXG4gICAgfSlcbiAgICB0aGlzLm1hcChsZWF2ZXMsIChrZXksIGxlZnRQcmVzZW5jZSkgPT4ge1xuICAgICAgbGV0IGN1cnJlbnRQcmVzZW5jZSA9IHN0YXRlW2tleV1cbiAgICAgIGlmKCFjdXJyZW50UHJlc2VuY2UpeyByZXR1cm4gfVxuICAgICAgbGV0IHJlZnNUb1JlbW92ZSA9IGxlZnRQcmVzZW5jZS5tZXRhcy5tYXAobSA9PiBtLnBoeF9yZWYpXG4gICAgICBjdXJyZW50UHJlc2VuY2UubWV0YXMgPSBjdXJyZW50UHJlc2VuY2UubWV0YXMuZmlsdGVyKHAgPT4ge1xuICAgICAgICByZXR1cm4gcmVmc1RvUmVtb3ZlLmluZGV4T2YocC5waHhfcmVmKSA8IDBcbiAgICAgIH0pXG4gICAgICBvbkxlYXZlKGtleSwgY3VycmVudFByZXNlbmNlLCBsZWZ0UHJlc2VuY2UpXG4gICAgICBpZihjdXJyZW50UHJlc2VuY2UubWV0YXMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgZGVsZXRlIHN0YXRlW2tleV1cbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBzdGF0ZVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGFycmF5IG9mIHByZXNlbmNlcywgd2l0aCBzZWxlY3RlZCBtZXRhZGF0YS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXNlbmNlc1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjaG9vc2VyXG4gICAqXG4gICAqIEByZXR1cm5zIHtQcmVzZW5jZX1cbiAgICovXG4gIHN0YXRpYyBsaXN0KHByZXNlbmNlcywgY2hvb3Nlcil7XG4gICAgaWYoIWNob29zZXIpeyBjaG9vc2VyID0gZnVuY3Rpb24gKGtleSwgcHJlcyl7IHJldHVybiBwcmVzIH0gfVxuXG4gICAgcmV0dXJuIHRoaXMubWFwKHByZXNlbmNlcywgKGtleSwgcHJlc2VuY2UpID0+IHtcbiAgICAgIHJldHVybiBjaG9vc2VyKGtleSwgcHJlc2VuY2UpXG4gICAgfSlcbiAgfVxuXG4gIC8vIHByaXZhdGVcblxuICBzdGF0aWMgbWFwKG9iaiwgZnVuYyl7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikubWFwKGtleSA9PiBmdW5jKGtleSwgb2JqW2tleV0pKVxuICB9XG5cbiAgc3RhdGljIGNsb25lKG9iail7IHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpIH1cbn1cbiIsICIvKiBUaGUgZGVmYXVsdCBzZXJpYWxpemVyIGZvciBlbmNvZGluZyBhbmQgZGVjb2RpbmcgbWVzc2FnZXMgKi9cbmltcG9ydCB7XG4gIENIQU5ORUxfRVZFTlRTXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgSEVBREVSX0xFTkdUSDogMSxcbiAgTUVUQV9MRU5HVEg6IDQsXG4gIEtJTkRTOiB7cHVzaDogMCwgcmVwbHk6IDEsIGJyb2FkY2FzdDogMn0sXG5cbiAgZW5jb2RlKG1zZywgY2FsbGJhY2spe1xuICAgIGlmKG1zZy5wYXlsb2FkLmNvbnN0cnVjdG9yID09PSBBcnJheUJ1ZmZlcil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sodGhpcy5iaW5hcnlFbmNvZGUobXNnKSlcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHBheWxvYWQgPSBbbXNnLmpvaW5fcmVmLCBtc2cucmVmLCBtc2cudG9waWMsIG1zZy5ldmVudCwgbXNnLnBheWxvYWRdXG4gICAgICByZXR1cm4gY2FsbGJhY2soSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpXG4gICAgfVxuICB9LFxuXG4gIGRlY29kZShyYXdQYXlsb2FkLCBjYWxsYmFjayl7XG4gICAgaWYocmF3UGF5bG9hZC5jb25zdHJ1Y3RvciA9PT0gQXJyYXlCdWZmZXIpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKHRoaXMuYmluYXJ5RGVjb2RlKHJhd1BheWxvYWQpKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgW2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZF0gPSBKU09OLnBhcnNlKHJhd1BheWxvYWQpXG4gICAgICByZXR1cm4gY2FsbGJhY2soe2pvaW5fcmVmLCByZWYsIHRvcGljLCBldmVudCwgcGF5bG9hZH0pXG4gICAgfVxuICB9LFxuXG4gIC8vIHByaXZhdGVcblxuICBiaW5hcnlFbmNvZGUobWVzc2FnZSl7XG4gICAgbGV0IHtqb2luX3JlZiwgcmVmLCBldmVudCwgdG9waWMsIHBheWxvYWR9ID0gbWVzc2FnZVxuICAgIGxldCBtZXRhTGVuZ3RoID0gdGhpcy5NRVRBX0xFTkdUSCArIGpvaW5fcmVmLmxlbmd0aCArIHJlZi5sZW5ndGggKyB0b3BpYy5sZW5ndGggKyBldmVudC5sZW5ndGhcbiAgICBsZXQgaGVhZGVyID0gbmV3IEFycmF5QnVmZmVyKHRoaXMuSEVBREVSX0xFTkdUSCArIG1ldGFMZW5ndGgpXG4gICAgbGV0IHZpZXcgPSBuZXcgRGF0YVZpZXcoaGVhZGVyKVxuICAgIGxldCBvZmZzZXQgPSAwXG5cbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0aGlzLktJTkRTLnB1c2gpIC8vIGtpbmRcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBqb2luX3JlZi5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgcmVmLmxlbmd0aClcbiAgICB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCB0b3BpYy5sZW5ndGgpXG4gICAgdmlldy5zZXRVaW50OChvZmZzZXQrKywgZXZlbnQubGVuZ3RoKVxuICAgIEFycmF5LmZyb20oam9pbl9yZWYsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKHJlZiwgY2hhciA9PiB2aWV3LnNldFVpbnQ4KG9mZnNldCsrLCBjaGFyLmNoYXJDb2RlQXQoMCkpKVxuICAgIEFycmF5LmZyb20odG9waWMsIGNoYXIgPT4gdmlldy5zZXRVaW50OChvZmZzZXQrKywgY2hhci5jaGFyQ29kZUF0KDApKSlcbiAgICBBcnJheS5mcm9tKGV2ZW50LCBjaGFyID0+IHZpZXcuc2V0VWludDgob2Zmc2V0KyssIGNoYXIuY2hhckNvZGVBdCgwKSkpXG5cbiAgICB2YXIgY29tYmluZWQgPSBuZXcgVWludDhBcnJheShoZWFkZXIuYnl0ZUxlbmd0aCArIHBheWxvYWQuYnl0ZUxlbmd0aClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkoaGVhZGVyKSwgMClcbiAgICBjb21iaW5lZC5zZXQobmV3IFVpbnQ4QXJyYXkocGF5bG9hZCksIGhlYWRlci5ieXRlTGVuZ3RoKVxuXG4gICAgcmV0dXJuIGNvbWJpbmVkLmJ1ZmZlclxuICB9LFxuXG4gIGJpbmFyeURlY29kZShidWZmZXIpe1xuICAgIGxldCB2aWV3ID0gbmV3IERhdGFWaWV3KGJ1ZmZlcilcbiAgICBsZXQga2luZCA9IHZpZXcuZ2V0VWludDgoMClcbiAgICBsZXQgZGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcigpXG4gICAgc3dpdGNoKGtpbmQpe1xuICAgICAgY2FzZSB0aGlzLktJTkRTLnB1c2g6IHJldHVybiB0aGlzLmRlY29kZVB1c2goYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgICAgY2FzZSB0aGlzLktJTkRTLnJlcGx5OiByZXR1cm4gdGhpcy5kZWNvZGVSZXBseShidWZmZXIsIHZpZXcsIGRlY29kZXIpXG4gICAgICBjYXNlIHRoaXMuS0lORFMuYnJvYWRjYXN0OiByZXR1cm4gdGhpcy5kZWNvZGVCcm9hZGNhc3QoYnVmZmVyLCB2aWV3LCBkZWNvZGVyKVxuICAgIH1cbiAgfSxcblxuICBkZWNvZGVQdXNoKGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDIpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoMylcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSCAtIDEgLy8gcHVzaGVzIGhhdmUgbm8gcmVmXG4gICAgbGV0IGpvaW5SZWYgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBqb2luUmVmU2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgam9pblJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9LFxuXG4gIGRlY29kZVJlcGx5KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IGpvaW5SZWZTaXplID0gdmlldy5nZXRVaW50OCgxKVxuICAgIGxldCByZWZTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCB0b3BpY1NpemUgPSB2aWV3LmdldFVpbnQ4KDMpXG4gICAgbGV0IGV2ZW50U2l6ZSA9IHZpZXcuZ2V0VWludDgoNClcbiAgICBsZXQgb2Zmc2V0ID0gdGhpcy5IRUFERVJfTEVOR1RIICsgdGhpcy5NRVRBX0xFTkdUSFxuICAgIGxldCBqb2luUmVmID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgam9pblJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGpvaW5SZWZTaXplXG4gICAgbGV0IHJlZiA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIHJlZlNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHJlZlNpemVcbiAgICBsZXQgdG9waWMgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyB0b3BpY1NpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIHRvcGljU2l6ZVxuICAgIGxldCBldmVudCA9IGRlY29kZXIuZGVjb2RlKGJ1ZmZlci5zbGljZShvZmZzZXQsIG9mZnNldCArIGV2ZW50U2l6ZSkpXG4gICAgb2Zmc2V0ID0gb2Zmc2V0ICsgZXZlbnRTaXplXG4gICAgbGV0IGRhdGEgPSBidWZmZXIuc2xpY2Uob2Zmc2V0LCBidWZmZXIuYnl0ZUxlbmd0aClcbiAgICBsZXQgcGF5bG9hZCA9IHtzdGF0dXM6IGV2ZW50LCByZXNwb25zZTogZGF0YX1cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBqb2luUmVmLCByZWY6IHJlZiwgdG9waWM6IHRvcGljLCBldmVudDogQ0hBTk5FTF9FVkVOVFMucmVwbHksIHBheWxvYWQ6IHBheWxvYWR9XG4gIH0sXG5cbiAgZGVjb2RlQnJvYWRjYXN0KGJ1ZmZlciwgdmlldywgZGVjb2Rlcil7XG4gICAgbGV0IHRvcGljU2l6ZSA9IHZpZXcuZ2V0VWludDgoMSlcbiAgICBsZXQgZXZlbnRTaXplID0gdmlldy5nZXRVaW50OCgyKVxuICAgIGxldCBvZmZzZXQgPSB0aGlzLkhFQURFUl9MRU5HVEggKyAyXG4gICAgbGV0IHRvcGljID0gZGVjb2Rlci5kZWNvZGUoYnVmZmVyLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgdG9waWNTaXplKSlcbiAgICBvZmZzZXQgPSBvZmZzZXQgKyB0b3BpY1NpemVcbiAgICBsZXQgZXZlbnQgPSBkZWNvZGVyLmRlY29kZShidWZmZXIuc2xpY2Uob2Zmc2V0LCBvZmZzZXQgKyBldmVudFNpemUpKVxuICAgIG9mZnNldCA9IG9mZnNldCArIGV2ZW50U2l6ZVxuICAgIGxldCBkYXRhID0gYnVmZmVyLnNsaWNlKG9mZnNldCwgYnVmZmVyLmJ5dGVMZW5ndGgpXG5cbiAgICByZXR1cm4ge2pvaW5fcmVmOiBudWxsLCByZWY6IG51bGwsIHRvcGljOiB0b3BpYywgZXZlbnQ6IGV2ZW50LCBwYXlsb2FkOiBkYXRhfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgZ2xvYmFsLFxuICBwaHhXaW5kb3csXG4gIENIQU5ORUxfRVZFTlRTLFxuICBERUZBVUxUX1RJTUVPVVQsXG4gIERFRkFVTFRfVlNOLFxuICBTT0NLRVRfU1RBVEVTLFxuICBUUkFOU1BPUlRTLFxuICBXU19DTE9TRV9OT1JNQUxcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvc3VyZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBBamF4IGZyb20gXCIuL2FqYXhcIlxuaW1wb3J0IENoYW5uZWwgZnJvbSBcIi4vY2hhbm5lbFwiXG5pbXBvcnQgTG9uZ1BvbGwgZnJvbSBcIi4vbG9uZ3BvbGxcIlxuaW1wb3J0IFNlcmlhbGl6ZXIgZnJvbSBcIi4vc2VyaWFsaXplclwiXG5pbXBvcnQgVGltZXIgZnJvbSBcIi4vdGltZXJcIlxuXG4vKiogSW5pdGlhbGl6ZXMgdGhlIFNvY2tldCAqXG4gKlxuICogRm9yIElFOCBzdXBwb3J0IHVzZSBhbiBFUzUtc2hpbSAoaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltKVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBlbmRQb2ludCAtIFRoZSBzdHJpbmcgV2ViU29ja2V0IGVuZHBvaW50LCBpZSwgYFwid3M6Ly9leGFtcGxlLmNvbS9zb2NrZXRcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwid3NzOi8vZXhhbXBsZS5jb21cImBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgXCIvc29ja2V0XCJgIChpbmhlcml0ZWQgaG9zdCAmIHByb3RvY29sKVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzXSAtIE9wdGlvbmFsIGNvbmZpZ3VyYXRpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnRyYW5zcG9ydF0gLSBUaGUgV2Vic29ja2V0IFRyYW5zcG9ydCwgZm9yIGV4YW1wbGUgV2ViU29ja2V0IG9yIFBob2VuaXguTG9uZ1BvbGwuXG4gKlxuICogRGVmYXVsdHMgdG8gV2ViU29ja2V0IHdpdGggYXV0b21hdGljIExvbmdQb2xsIGZhbGxiYWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW29wdHMuZW5jb2RlXSAtIFRoZSBmdW5jdGlvbiB0byBlbmNvZGUgb3V0Z29pbmcgbWVzc2FnZXMuXG4gKlxuICogRGVmYXVsdHMgdG8gSlNPTiBlbmNvZGVyLlxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLmRlY29kZV0gLSBUaGUgZnVuY3Rpb24gdG8gZGVjb2RlIGluY29taW5nIG1lc3NhZ2VzLlxuICpcbiAqIERlZmF1bHRzIHRvIEpTT046XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogKHBheWxvYWQsIGNhbGxiYWNrKSA9PiBjYWxsYmFjayhKU09OLnBhcnNlKHBheWxvYWQpKVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtvcHRzLnRpbWVvdXRdIC0gVGhlIGRlZmF1bHQgdGltZW91dCBpbiBtaWxsaXNlY29uZHMgdG8gdHJpZ2dlciBwdXNoIHRpbWVvdXRzLlxuICpcbiAqIERlZmF1bHRzIGBERUZBVUxUX1RJTUVPVVRgXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMuaGVhcnRiZWF0SW50ZXJ2YWxNc10gLSBUaGUgbWlsbGlzZWMgaW50ZXJ2YWwgdG8gc2VuZCBhIGhlYXJ0YmVhdCBtZXNzYWdlXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMucmVjb25uZWN0QWZ0ZXJNc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gdGhhdCByZXR1cm5zIHRoZSBtaWxsaXNlY1xuICogc29ja2V0IHJlY29ubmVjdCBpbnRlcnZhbC5cbiAqXG4gKiBEZWZhdWx0cyB0byBzdGVwcGVkIGJhY2tvZmYgb2Y6XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwLCA1MCwgMTAwLCAxNTAsIDIwMCwgMjUwLCA1MDAsIDEwMDAsIDIwMDBdW3RyaWVzIC0gMV0gfHwgNTAwMFxuICogfVxuICogYGBgYFxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0cy5yZWpvaW5BZnRlck1zXSAtIFRoZSBvcHRpb25hbCBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIG1pbGxpc2VjXG4gKiByZWpvaW4gaW50ZXJ2YWwgZm9yIGluZGl2aWR1YWwgY2hhbm5lbHMuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24odHJpZXMpe1xuICogICByZXR1cm4gWzEwMDAsIDIwMDAsIDUwMDBdW3RyaWVzIC0gMV0gfHwgMTAwMDBcbiAqIH1cbiAqIGBgYGBcbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbb3B0cy5sb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIGZvciBzcGVjaWFsaXplZCBsb2dnaW5nLCBpZTpcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbihraW5kLCBtc2csIGRhdGEpIHtcbiAqICAgY29uc29sZS5sb2coYCR7a2luZH06ICR7bXNnfWAsIGRhdGEpXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW29wdHMubG9uZ3BvbGxlclRpbWVvdXRdIC0gVGhlIG1heGltdW0gdGltZW91dCBvZiBhIGxvbmcgcG9sbCBBSkFYIHJlcXVlc3QuXG4gKlxuICogRGVmYXVsdHMgdG8gMjBzIChkb3VibGUgdGhlIHNlcnZlciBsb25nIHBvbGwgdGltZXIpLlxuICpcbiAqIEBwYXJhbSB7KE9iamVjdHxmdW5jdGlvbil9IFtvcHRzLnBhcmFtc10gLSBUaGUgb3B0aW9uYWwgcGFyYW1zIHRvIHBhc3Mgd2hlbiBjb25uZWN0aW5nXG4gKiBAcGFyYW0ge3N0cmluZ30gW29wdHMuYmluYXJ5VHlwZV0gLSBUaGUgYmluYXJ5IHR5cGUgdG8gdXNlIGZvciBiaW5hcnkgV2ViU29ja2V0IGZyYW1lcy5cbiAqXG4gKiBEZWZhdWx0cyB0byBcImFycmF5YnVmZmVyXCJcbiAqXG4gKiBAcGFyYW0ge3Zzbn0gW29wdHMudnNuXSAtIFRoZSBzZXJpYWxpemVyJ3MgcHJvdG9jb2wgdmVyc2lvbiB0byBzZW5kIG9uIGNvbm5lY3QuXG4gKlxuICogRGVmYXVsdHMgdG8gREVGQVVMVF9WU04uXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU29ja2V0IHtcbiAgY29uc3RydWN0b3IoZW5kUG9pbnQsIG9wdHMgPSB7fSl7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcyA9IHtvcGVuOiBbXSwgY2xvc2U6IFtdLCBlcnJvcjogW10sIG1lc3NhZ2U6IFtdfVxuICAgIHRoaXMuY2hhbm5lbHMgPSBbXVxuICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgdGhpcy5yZWYgPSAwXG4gICAgdGhpcy50aW1lb3V0ID0gb3B0cy50aW1lb3V0IHx8IERFRkFVTFRfVElNRU9VVFxuICAgIHRoaXMudHJhbnNwb3J0ID0gb3B0cy50cmFuc3BvcnQgfHwgZ2xvYmFsLldlYlNvY2tldCB8fCBMb25nUG9sbFxuICAgIHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9ucyA9IDBcbiAgICB0aGlzLmRlZmF1bHRFbmNvZGVyID0gU2VyaWFsaXplci5lbmNvZGUuYmluZChTZXJpYWxpemVyKVxuICAgIHRoaXMuZGVmYXVsdERlY29kZXIgPSBTZXJpYWxpemVyLmRlY29kZS5iaW5kKFNlcmlhbGl6ZXIpXG4gICAgdGhpcy5jbG9zZVdhc0NsZWFuID0gZmFsc2VcbiAgICB0aGlzLmJpbmFyeVR5cGUgPSBvcHRzLmJpbmFyeVR5cGUgfHwgXCJhcnJheWJ1ZmZlclwiXG4gICAgdGhpcy5jb25uZWN0Q2xvY2sgPSAxXG4gICAgaWYodGhpcy50cmFuc3BvcnQgIT09IExvbmdQb2xsKXtcbiAgICAgIHRoaXMuZW5jb2RlID0gb3B0cy5lbmNvZGUgfHwgdGhpcy5kZWZhdWx0RW5jb2RlclxuICAgICAgdGhpcy5kZWNvZGUgPSBvcHRzLmRlY29kZSB8fCB0aGlzLmRlZmF1bHREZWNvZGVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZW5jb2RlID0gdGhpcy5kZWZhdWx0RW5jb2RlclxuICAgICAgdGhpcy5kZWNvZGUgPSB0aGlzLmRlZmF1bHREZWNvZGVyXG4gICAgfVxuICAgIGxldCBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gbnVsbFxuICAgIGlmKHBoeFdpbmRvdyAmJiBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcil7XG4gICAgICBwaHhXaW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgICB0aGlzLmRpc2Nvbm5lY3QoKVxuICAgICAgICAgIGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPSB0aGlzLmNvbm5lY3RDbG9ja1xuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgcGh4V2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwYWdlc2hvd1wiLCBfZSA9PiB7XG4gICAgICAgIGlmKGF3YWl0aW5nQ29ubmVjdGlvbk9uUGFnZVNob3cgPT09IHRoaXMuY29ubmVjdENsb2NrKXtcbiAgICAgICAgICBhd2FpdGluZ0Nvbm5lY3Rpb25PblBhZ2VTaG93ID0gbnVsbFxuICAgICAgICAgIHRoaXMuY29ubmVjdCgpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICAgIHRoaXMuaGVhcnRiZWF0SW50ZXJ2YWxNcyA9IG9wdHMuaGVhcnRiZWF0SW50ZXJ2YWxNcyB8fCAzMDAwMFxuICAgIHRoaXMucmVqb2luQWZ0ZXJNcyA9ICh0cmllcykgPT4ge1xuICAgICAgaWYob3B0cy5yZWpvaW5BZnRlck1zKXtcbiAgICAgICAgcmV0dXJuIG9wdHMucmVqb2luQWZ0ZXJNcyh0cmllcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbMTAwMCwgMjAwMCwgNTAwMF1bdHJpZXMgLSAxXSB8fCAxMDAwMFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnJlY29ubmVjdEFmdGVyTXMgPSAodHJpZXMpID0+IHtcbiAgICAgIGlmKG9wdHMucmVjb25uZWN0QWZ0ZXJNcyl7XG4gICAgICAgIHJldHVybiBvcHRzLnJlY29ubmVjdEFmdGVyTXModHJpZXMpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gWzEwLCA1MCwgMTAwLCAxNTAsIDIwMCwgMjUwLCA1MDAsIDEwMDAsIDIwMDBdW3RyaWVzIC0gMV0gfHwgNTAwMFxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvZ2dlciA9IG9wdHMubG9nZ2VyIHx8IG51bGxcbiAgICB0aGlzLmxvbmdwb2xsZXJUaW1lb3V0ID0gb3B0cy5sb25ncG9sbGVyVGltZW91dCB8fCAyMDAwMFxuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLmVuZFBvaW50ID0gYCR7ZW5kUG9pbnR9LyR7VFJBTlNQT1JUUy53ZWJzb2NrZXR9YFxuICAgIHRoaXMudnNuID0gb3B0cy52c24gfHwgREVGQVVMVF9WU05cbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVvdXRUaW1lciA9IG51bGxcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICB0aGlzLnJlY29ubmVjdFRpbWVyID0gbmV3IFRpbWVyKCgpID0+IHtcbiAgICAgIHRoaXMudGVhcmRvd24oKCkgPT4gdGhpcy5jb25uZWN0KCkpXG4gICAgfSwgdGhpcy5yZWNvbm5lY3RBZnRlck1zKVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIExvbmdQb2xsIHRyYW5zcG9ydCByZWZlcmVuY2VcbiAgICovXG4gIGdldExvbmdQb2xsVHJhbnNwb3J0KCl7IHJldHVybiBMb25nUG9sbCB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIGFuZCByZXBsYWNlcyB0aGUgYWN0aXZlIHRyYW5zcG9ydFxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBuZXdUcmFuc3BvcnQgLSBUaGUgbmV3IHRyYW5zcG9ydCBjbGFzcyB0byBpbnN0YW50aWF0ZVxuICAgKlxuICAgKi9cbiAgcmVwbGFjZVRyYW5zcG9ydChuZXdUcmFuc3BvcnQpe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy5zZW5kQnVmZmVyID0gW11cbiAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgdGhpcy5jb25uLmNsb3NlKClcbiAgICAgIHRoaXMuY29ubiA9IG51bGxcbiAgICB9XG4gICAgdGhpcy50cmFuc3BvcnQgPSBuZXdUcmFuc3BvcnRcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzb2NrZXQgcHJvdG9jb2xcbiAgICpcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIHByb3RvY29sKCl7IHJldHVybiBsb2NhdGlvbi5wcm90b2NvbC5tYXRjaCgvXmh0dHBzLykgPyBcIndzc1wiIDogXCJ3c1wiIH1cblxuICAvKipcbiAgICogVGhlIGZ1bGx5IHF1YWxpZmllZCBzb2NrZXQgdXJsXG4gICAqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBlbmRQb2ludFVSTCgpe1xuICAgIGxldCB1cmkgPSBBamF4LmFwcGVuZFBhcmFtcyhcbiAgICAgIEFqYXguYXBwZW5kUGFyYW1zKHRoaXMuZW5kUG9pbnQsIHRoaXMucGFyYW1zKCkpLCB7dnNuOiB0aGlzLnZzbn0pXG4gICAgaWYodXJpLmNoYXJBdCgwKSAhPT0gXCIvXCIpeyByZXR1cm4gdXJpIH1cbiAgICBpZih1cmkuY2hhckF0KDEpID09PSBcIi9cIil7IHJldHVybiBgJHt0aGlzLnByb3RvY29sKCl9OiR7dXJpfWAgfVxuXG4gICAgcmV0dXJuIGAke3RoaXMucHJvdG9jb2woKX06Ly8ke2xvY2F0aW9uLmhvc3R9JHt1cml9YFxuICB9XG5cbiAgLyoqXG4gICAqIERpc2Nvbm5lY3RzIHRoZSBzb2NrZXRcbiAgICpcbiAgICogU2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9DbG9zZUV2ZW50I1N0YXR1c19jb2RlcyBmb3IgdmFsaWQgc3RhdHVzIGNvZGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFjayAtIE9wdGlvbmFsIGNhbGxiYWNrIHdoaWNoIGlzIGNhbGxlZCBhZnRlciBzb2NrZXQgaXMgZGlzY29ubmVjdGVkLlxuICAgKiBAcGFyYW0ge2ludGVnZXJ9IGNvZGUgLSBBIHN0YXR1cyBjb2RlIGZvciBkaXNjb25uZWN0aW9uIChPcHRpb25hbCkuXG4gICAqIEBwYXJhbSB7c3RyaW5nfSByZWFzb24gLSBBIHRleHR1YWwgZGVzY3JpcHRpb24gb2YgdGhlIHJlYXNvbiB0byBkaXNjb25uZWN0LiAoT3B0aW9uYWwpXG4gICAqL1xuICBkaXNjb25uZWN0KGNhbGxiYWNrLCBjb2RlLCByZWFzb24pe1xuICAgIHRoaXMuY29ubmVjdENsb2NrKytcbiAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSB0cnVlXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy50ZWFyZG93bihjYWxsYmFjaywgY29kZSwgcmVhc29uKVxuICB9XG5cbiAgLyoqXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgLSBUaGUgcGFyYW1zIHRvIHNlbmQgd2hlbiBjb25uZWN0aW5nLCBmb3IgZXhhbXBsZSBge3VzZXJfaWQ6IHVzZXJUb2tlbn1gXG4gICAqXG4gICAqIFBhc3NpbmcgcGFyYW1zIHRvIGNvbm5lY3QgaXMgZGVwcmVjYXRlZDsgcGFzcyB0aGVtIGluIHRoZSBTb2NrZXQgY29uc3RydWN0b3IgaW5zdGVhZDpcbiAgICogYG5ldyBTb2NrZXQoXCIvc29ja2V0XCIsIHtwYXJhbXM6IHt1c2VyX2lkOiB1c2VyVG9rZW59fSlgLlxuICAgKi9cbiAgY29ubmVjdChwYXJhbXMpe1xuICAgIGlmKHBhcmFtcyl7XG4gICAgICBjb25zb2xlICYmIGNvbnNvbGUubG9nKFwicGFzc2luZyBwYXJhbXMgdG8gY29ubmVjdCBpcyBkZXByZWNhdGVkLiBJbnN0ZWFkIHBhc3MgOnBhcmFtcyB0byB0aGUgU29ja2V0IGNvbnN0cnVjdG9yXCIpXG4gICAgICB0aGlzLnBhcmFtcyA9IGNsb3N1cmUocGFyYW1zKVxuICAgIH1cbiAgICBpZih0aGlzLmNvbm4peyByZXR1cm4gfVxuXG4gICAgdGhpcy5jb25uZWN0Q2xvY2srK1xuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5jb25uID0gbmV3IHRoaXMudHJhbnNwb3J0KHRoaXMuZW5kUG9pbnRVUkwoKSlcbiAgICB0aGlzLmNvbm4uYmluYXJ5VHlwZSA9IHRoaXMuYmluYXJ5VHlwZVxuICAgIHRoaXMuY29ubi50aW1lb3V0ID0gdGhpcy5sb25ncG9sbGVyVGltZW91dFxuICAgIHRoaXMuY29ubi5vbm9wZW4gPSAoKSA9PiB0aGlzLm9uQ29ubk9wZW4oKVxuICAgIHRoaXMuY29ubi5vbmVycm9yID0gZXJyb3IgPT4gdGhpcy5vbkNvbm5FcnJvcihlcnJvcilcbiAgICB0aGlzLmNvbm4ub25tZXNzYWdlID0gZXZlbnQgPT4gdGhpcy5vbkNvbm5NZXNzYWdlKGV2ZW50KVxuICAgIHRoaXMuY29ubi5vbmNsb3NlID0gZXZlbnQgPT4gdGhpcy5vbkNvbm5DbG9zZShldmVudClcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIHRoZSBtZXNzYWdlLiBPdmVycmlkZSBgdGhpcy5sb2dnZXJgIGZvciBzcGVjaWFsaXplZCBsb2dnaW5nLiBub29wcyBieSBkZWZhdWx0XG4gICAqIEBwYXJhbSB7c3RyaW5nfSBraW5kXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBtc2dcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIGxvZyhraW5kLCBtc2csIGRhdGEpeyB0aGlzLmxvZ2dlcihraW5kLCBtc2csIGRhdGEpIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGEgbG9nZ2VyIGhhcyBiZWVuIHNldCBvbiB0aGlzIHNvY2tldC5cbiAgICovXG4gIGhhc0xvZ2dlcigpeyByZXR1cm4gdGhpcy5sb2dnZXIgIT09IG51bGwgfVxuXG4gIC8qKlxuICAgKiBSZWdpc3RlcnMgY2FsbGJhY2tzIGZvciBjb25uZWN0aW9uIG9wZW4gZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbk9wZW4oZnVuY3Rpb24oKXsgY29uc29sZS5pbmZvKFwidGhlIHNvY2tldCB3YXMgb3BlbmVkXCIpIH0pXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAqL1xuICBvbk9wZW4oY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3Mub3Blbi5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBjbG9zZSBldmVudHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICovXG4gIG9uQ2xvc2UoY2FsbGJhY2spe1xuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuY2xvc2UucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVycyBjYWxsYmFja3MgZm9yIGNvbm5lY3Rpb24gZXJyb3IgZXZlbnRzXG4gICAqXG4gICAqIEBleGFtcGxlIHNvY2tldC5vbkVycm9yKGZ1bmN0aW9uKGVycm9yKXsgYWxlcnQoXCJBbiBlcnJvciBvY2N1cnJlZFwiKSB9KVxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25FcnJvcihjYWxsYmFjayl7XG4gICAgbGV0IHJlZiA9IHRoaXMubWFrZVJlZigpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5lcnJvci5wdXNoKFtyZWYsIGNhbGxiYWNrXSlcbiAgICByZXR1cm4gcmVmXG4gIH1cblxuICAvKipcbiAgICogUmVnaXN0ZXJzIGNhbGxiYWNrcyBmb3IgY29ubmVjdGlvbiBtZXNzYWdlIGV2ZW50c1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgKi9cbiAgb25NZXNzYWdlKGNhbGxiYWNrKXtcbiAgICBsZXQgcmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2UucHVzaChbcmVmLCBjYWxsYmFja10pXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgLyoqXG4gICAqIFBpbmdzIHRoZSBzZXJ2ZXIgYW5kIGludm9rZXMgdGhlIGNhbGxiYWNrIHdpdGggdGhlIFJUVCBpbiBtaWxsaXNlY29uZHNcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICpcbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBwaW5nIHdhcyBwdXNoZWQgb3IgZmFsc2UgaWYgdW5hYmxlIHRvIGJlIHB1c2hlZC5cbiAgICovXG4gIHBpbmcoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmlzQ29ubmVjdGVkKCkpeyByZXR1cm4gZmFsc2UgfVxuICAgIGxldCByZWYgPSB0aGlzLm1ha2VSZWYoKVxuICAgIGxldCBzdGFydFRpbWUgPSBEYXRlLm5vdygpXG4gICAgdGhpcy5wdXNoKHt0b3BpYzogXCJwaG9lbml4XCIsIGV2ZW50OiBcImhlYXJ0YmVhdFwiLCBwYXlsb2FkOiB7fSwgcmVmOiByZWZ9KVxuICAgIGxldCBvbk1zZ1JlZiA9IHRoaXMub25NZXNzYWdlKG1zZyA9PiB7XG4gICAgICBpZihtc2cucmVmID09PSByZWYpe1xuICAgICAgICB0aGlzLm9mZihbb25Nc2dSZWZdKVxuICAgICAgICBjYWxsYmFjayhEYXRlLm5vdygpIC0gc3RhcnRUaW1lKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIHRydWVcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBjbGVhckhlYXJ0YmVhdHMoKXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lcilcbiAgICBjbGVhclRpbWVvdXQodGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIpXG4gIH1cblxuICBvbkNvbm5PcGVuKCl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYGNvbm5lY3RlZCB0byAke3RoaXMuZW5kUG9pbnRVUkwoKX1gKVxuICAgIHRoaXMuY2xvc2VXYXNDbGVhbiA9IGZhbHNlXG4gICAgdGhpcy5lc3RhYmxpc2hlZENvbm5lY3Rpb25zKytcbiAgICB0aGlzLmZsdXNoU2VuZEJ1ZmZlcigpXG4gICAgdGhpcy5yZWNvbm5lY3RUaW1lci5yZXNldCgpXG4gICAgdGhpcy5yZXNldEhlYXJ0YmVhdCgpXG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5vcGVuLmZvckVhY2goKFssIGNhbGxiYWNrXSkgPT4gY2FsbGJhY2soKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cblxuICBoZWFydGJlYXRUaW1lb3V0KCl7XG4gICAgaWYodGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmKXtcbiAgICAgIHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZiA9IG51bGxcbiAgICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpeyB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImhlYXJ0YmVhdCB0aW1lb3V0LiBBdHRlbXB0aW5nIHRvIHJlLWVzdGFibGlzaCBjb25uZWN0aW9uXCIpIH1cbiAgICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgICB0aGlzLmNsb3NlV2FzQ2xlYW4gPSBmYWxzZVxuICAgICAgdGhpcy50ZWFyZG93bigoKSA9PiB0aGlzLnJlY29ubmVjdFRpbWVyLnNjaGVkdWxlVGltZW91dCgpLCBXU19DTE9TRV9OT1JNQUwsIFwiaGVhcnRiZWF0IHRpbWVvdXRcIilcbiAgICB9XG4gIH1cblxuICByZXNldEhlYXJ0YmVhdCgpe1xuICAgIGlmKHRoaXMuY29ubiAmJiB0aGlzLmNvbm4uc2tpcEhlYXJ0YmVhdCl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICB9XG5cbiAgdGVhcmRvd24oY2FsbGJhY2ssIGNvZGUsIHJlYXNvbil7XG4gICAgaWYoIXRoaXMuY29ubil7XG4gICAgICByZXR1cm4gY2FsbGJhY2sgJiYgY2FsbGJhY2soKVxuICAgIH1cblxuICAgIHRoaXMud2FpdEZvckJ1ZmZlckRvbmUoKCkgPT4ge1xuICAgICAgaWYodGhpcy5jb25uKXtcbiAgICAgICAgaWYoY29kZSl7IHRoaXMuY29ubi5jbG9zZShjb2RlLCByZWFzb24gfHwgXCJcIikgfSBlbHNlIHsgdGhpcy5jb25uLmNsb3NlKCkgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLndhaXRGb3JTb2NrZXRDbG9zZWQoKCkgPT4ge1xuICAgICAgICBpZih0aGlzLmNvbm4pe1xuICAgICAgICAgIHRoaXMuY29ubi5vbm9wZW4gPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9uZXJyb3IgPSBmdW5jdGlvbiAoKXsgfSAvLyBub29wXG4gICAgICAgICAgdGhpcy5jb25uLm9ubWVzc2FnZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4ub25jbG9zZSA9IGZ1bmN0aW9uICgpeyB9IC8vIG5vb3BcbiAgICAgICAgICB0aGlzLmNvbm4gPSBudWxsXG4gICAgICAgIH1cblxuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjaygpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICB3YWl0Rm9yQnVmZmVyRG9uZShjYWxsYmFjaywgdHJpZXMgPSAxKXtcbiAgICBpZih0cmllcyA9PT0gNSB8fCAhdGhpcy5jb25uIHx8ICF0aGlzLmNvbm4uYnVmZmVyZWRBbW91bnQpe1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLndhaXRGb3JCdWZmZXJEb25lKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICB3YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyA9IDEpe1xuICAgIGlmKHRyaWVzID09PSA1IHx8ICF0aGlzLmNvbm4gfHwgdGhpcy5jb25uLnJlYWR5U3RhdGUgPT09IFNPQ0tFVF9TVEFURVMuY2xvc2VkKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy53YWl0Rm9yU29ja2V0Q2xvc2VkKGNhbGxiYWNrLCB0cmllcyArIDEpXG4gICAgfSwgMTUwICogdHJpZXMpXG4gIH1cblxuICBvbkNvbm5DbG9zZShldmVudCl7XG4gICAgbGV0IGNsb3NlQ29kZSA9IGV2ZW50ICYmIGV2ZW50LmNvZGVcbiAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInRyYW5zcG9ydFwiLCBcImNsb3NlXCIsIGV2ZW50KVxuICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgdGhpcy5jbGVhckhlYXJ0YmVhdHMoKVxuICAgIGlmKCF0aGlzLmNsb3NlV2FzQ2xlYW4gJiYgY2xvc2VDb2RlICE9PSAxMDAwKXtcbiAgICAgIHRoaXMucmVjb25uZWN0VGltZXIuc2NoZWR1bGVUaW1lb3V0KClcbiAgICB9XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcy5jbG9zZS5mb3JFYWNoKChbLCBjYWxsYmFja10pID0+IGNhbGxiYWNrKGV2ZW50KSlcbiAgfVxuXG4gIC8qKlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgb25Db25uRXJyb3IoZXJyb3Ipe1xuICAgIGlmKHRoaXMuaGFzTG9nZ2VyKCkpIHRoaXMubG9nKFwidHJhbnNwb3J0XCIsIGVycm9yKVxuICAgIGxldCB0cmFuc3BvcnRCZWZvcmUgPSB0aGlzLnRyYW5zcG9ydFxuICAgIGxldCBlc3RhYmxpc2hlZEJlZm9yZSA9IHRoaXMuZXN0YWJsaXNoZWRDb25uZWN0aW9uc1xuICAgIHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MuZXJyb3IuZm9yRWFjaCgoWywgY2FsbGJhY2tdKSA9PiB7XG4gICAgICBjYWxsYmFjayhlcnJvciwgdHJhbnNwb3J0QmVmb3JlLCBlc3RhYmxpc2hlZEJlZm9yZSlcbiAgICB9KVxuICAgIGlmKHRyYW5zcG9ydEJlZm9yZSA9PT0gdGhpcy50cmFuc3BvcnQgfHwgZXN0YWJsaXNoZWRCZWZvcmUgPiAwKXtcbiAgICAgIHRoaXMudHJpZ2dlckNoYW5FcnJvcigpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICB0cmlnZ2VyQ2hhbkVycm9yKCl7XG4gICAgdGhpcy5jaGFubmVscy5mb3JFYWNoKGNoYW5uZWwgPT4ge1xuICAgICAgaWYoIShjaGFubmVsLmlzRXJyb3JlZCgpIHx8IGNoYW5uZWwuaXNMZWF2aW5nKCkgfHwgY2hhbm5lbC5pc0Nsb3NlZCgpKSl7XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihDSEFOTkVMX0VWRU5UUy5lcnJvcilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBjb25uZWN0aW9uU3RhdGUoKXtcbiAgICBzd2l0Y2godGhpcy5jb25uICYmIHRoaXMuY29ubi5yZWFkeVN0YXRlKXtcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jb25uZWN0aW5nOiByZXR1cm4gXCJjb25uZWN0aW5nXCJcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5vcGVuOiByZXR1cm4gXCJvcGVuXCJcbiAgICAgIGNhc2UgU09DS0VUX1NUQVRFUy5jbG9zaW5nOiByZXR1cm4gXCJjbG9zaW5nXCJcbiAgICAgIGRlZmF1bHQ6IHJldHVybiBcImNsb3NlZFwiXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgKi9cbiAgaXNDb25uZWN0ZWQoKXsgcmV0dXJuIHRoaXMuY29ubmVjdGlvblN0YXRlKCkgPT09IFwib3BlblwiIH1cblxuICAvKipcbiAgICogQHByaXZhdGVcbiAgICpcbiAgICogQHBhcmFtIHtDaGFubmVsfVxuICAgKi9cbiAgcmVtb3ZlKGNoYW5uZWwpe1xuICAgIHRoaXMub2ZmKGNoYW5uZWwuc3RhdGVDaGFuZ2VSZWZzKVxuICAgIHRoaXMuY2hhbm5lbHMgPSB0aGlzLmNoYW5uZWxzLmZpbHRlcihjID0+IGMuam9pblJlZigpICE9PSBjaGFubmVsLmpvaW5SZWYoKSlcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIGBvbk9wZW5gLCBgb25DbG9zZWAsIGBvbkVycm9yLGAgYW5kIGBvbk1lc3NhZ2VgIHJlZ2lzdHJhdGlvbnMuXG4gICAqXG4gICAqIEBwYXJhbSB7cmVmc30gLSBsaXN0IG9mIHJlZnMgcmV0dXJuZWQgYnkgY2FsbHMgdG9cbiAgICogICAgICAgICAgICAgICAgIGBvbk9wZW5gLCBgb25DbG9zZWAsIGBvbkVycm9yLGAgYW5kIGBvbk1lc3NhZ2VgXG4gICAqL1xuICBvZmYocmVmcyl7XG4gICAgZm9yKGxldCBrZXkgaW4gdGhpcy5zdGF0ZUNoYW5nZUNhbGxiYWNrcyl7XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzW2tleV0gPSB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzW2tleV0uZmlsdGVyKChbcmVmXSkgPT4ge1xuICAgICAgICByZXR1cm4gcmVmcy5pbmRleE9mKHJlZikgPT09IC0xXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWF0ZXMgYSBuZXcgY2hhbm5lbCBmb3IgdGhlIGdpdmVuIHRvcGljXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB0b3BpY1xuICAgKiBAcGFyYW0ge09iamVjdH0gY2hhblBhcmFtcyAtIFBhcmFtZXRlcnMgZm9yIHRoZSBjaGFubmVsXG4gICAqIEByZXR1cm5zIHtDaGFubmVsfVxuICAgKi9cbiAgY2hhbm5lbCh0b3BpYywgY2hhblBhcmFtcyA9IHt9KXtcbiAgICBsZXQgY2hhbiA9IG5ldyBDaGFubmVsKHRvcGljLCBjaGFuUGFyYW1zLCB0aGlzKVxuICAgIHRoaXMuY2hhbm5lbHMucHVzaChjaGFuKVxuICAgIHJldHVybiBjaGFuXG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGFcbiAgICovXG4gIHB1c2goZGF0YSl7XG4gICAgaWYodGhpcy5oYXNMb2dnZXIoKSl7XG4gICAgICBsZXQge3RvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZn0gPSBkYXRhXG4gICAgICB0aGlzLmxvZyhcInB1c2hcIiwgYCR7dG9waWN9ICR7ZXZlbnR9ICgke2pvaW5fcmVmfSwgJHtyZWZ9KWAsIHBheWxvYWQpXG4gICAgfVxuXG4gICAgaWYodGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMuZW5jb2RlKGRhdGEsIHJlc3VsdCA9PiB0aGlzLmNvbm4uc2VuZChyZXN1bHQpKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlbmRCdWZmZXIucHVzaCgoKSA9PiB0aGlzLmVuY29kZShkYXRhLCByZXN1bHQgPT4gdGhpcy5jb25uLnNlbmQocmVzdWx0KSkpXG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbmV4dCBtZXNzYWdlIHJlZiwgYWNjb3VudGluZyBmb3Igb3ZlcmZsb3dzXG4gICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAqL1xuICBtYWtlUmVmKCl7XG4gICAgbGV0IG5ld1JlZiA9IHRoaXMucmVmICsgMVxuICAgIGlmKG5ld1JlZiA9PT0gdGhpcy5yZWYpeyB0aGlzLnJlZiA9IDAgfSBlbHNlIHsgdGhpcy5yZWYgPSBuZXdSZWYgfVxuXG4gICAgcmV0dXJuIHRoaXMucmVmLnRvU3RyaW5nKClcbiAgfVxuXG4gIHNlbmRIZWFydGJlYXQoKXtcbiAgICBpZih0aGlzLnBlbmRpbmdIZWFydGJlYXRSZWYgJiYgIXRoaXMuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gdGhpcy5tYWtlUmVmKClcbiAgICB0aGlzLnB1c2goe3RvcGljOiBcInBob2VuaXhcIiwgZXZlbnQ6IFwiaGVhcnRiZWF0XCIsIHBheWxvYWQ6IHt9LCByZWY6IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZn0pXG4gICAgdGhpcy5oZWFydGJlYXRUaW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuaGVhcnRiZWF0VGltZW91dCgpLCB0aGlzLmhlYXJ0YmVhdEludGVydmFsTXMpXG4gIH1cblxuICBmbHVzaFNlbmRCdWZmZXIoKXtcbiAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkgJiYgdGhpcy5zZW5kQnVmZmVyLmxlbmd0aCA+IDApe1xuICAgICAgdGhpcy5zZW5kQnVmZmVyLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2soKSlcbiAgICAgIHRoaXMuc2VuZEJ1ZmZlciA9IFtdXG4gICAgfVxuICB9XG5cbiAgb25Db25uTWVzc2FnZShyYXdNZXNzYWdlKXtcbiAgICB0aGlzLmRlY29kZShyYXdNZXNzYWdlLmRhdGEsIG1zZyA9PiB7XG4gICAgICBsZXQge3RvcGljLCBldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZn0gPSBtc2dcbiAgICAgIGlmKHJlZiAmJiByZWYgPT09IHRoaXMucGVuZGluZ0hlYXJ0YmVhdFJlZil7XG4gICAgICAgIHRoaXMuY2xlYXJIZWFydGJlYXRzKClcbiAgICAgICAgdGhpcy5wZW5kaW5nSGVhcnRiZWF0UmVmID0gbnVsbFxuICAgICAgICB0aGlzLmhlYXJ0YmVhdFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnNlbmRIZWFydGJlYXQoKSwgdGhpcy5oZWFydGJlYXRJbnRlcnZhbE1zKVxuICAgICAgfVxuXG4gICAgICBpZih0aGlzLmhhc0xvZ2dlcigpKSB0aGlzLmxvZyhcInJlY2VpdmVcIiwgYCR7cGF5bG9hZC5zdGF0dXMgfHwgXCJcIn0gJHt0b3BpY30gJHtldmVudH0gJHtyZWYgJiYgXCIoXCIgKyByZWYgKyBcIilcIiB8fCBcIlwifWAsIHBheWxvYWQpXG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCB0aGlzLmNoYW5uZWxzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgY29uc3QgY2hhbm5lbCA9IHRoaXMuY2hhbm5lbHNbaV1cbiAgICAgICAgaWYoIWNoYW5uZWwuaXNNZW1iZXIodG9waWMsIGV2ZW50LCBwYXlsb2FkLCBqb2luX3JlZikpeyBjb250aW51ZSB9XG4gICAgICAgIGNoYW5uZWwudHJpZ2dlcihldmVudCwgcGF5bG9hZCwgcmVmLCBqb2luX3JlZilcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMuc3RhdGVDaGFuZ2VDYWxsYmFja3MubWVzc2FnZS5sZW5ndGg7IGkrKyl7XG4gICAgICAgIGxldCBbLCBjYWxsYmFja10gPSB0aGlzLnN0YXRlQ2hhbmdlQ2FsbGJhY2tzLm1lc3NhZ2VbaV1cbiAgICAgICAgY2FsbGJhY2sobXNnKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBsZWF2ZU9wZW5Ub3BpYyh0b3BpYyl7XG4gICAgbGV0IGR1cENoYW5uZWwgPSB0aGlzLmNoYW5uZWxzLmZpbmQoYyA9PiBjLnRvcGljID09PSB0b3BpYyAmJiAoYy5pc0pvaW5lZCgpIHx8IGMuaXNKb2luaW5nKCkpKVxuICAgIGlmKGR1cENoYW5uZWwpe1xuICAgICAgaWYodGhpcy5oYXNMb2dnZXIoKSkgdGhpcy5sb2coXCJ0cmFuc3BvcnRcIiwgYGxlYXZpbmcgZHVwbGljYXRlIHRvcGljIFwiJHt0b3BpY31cImApXG4gICAgICBkdXBDaGFubmVsLmxlYXZlKClcbiAgICB9XG4gIH1cbn0iLCAiXG5leHBvcnQgY29uc3QgQ09OU0VDVVRJVkVfUkVMT0FEUyA9IFwiY29uc2VjdXRpdmUtcmVsb2Fkc1wiXG5leHBvcnQgY29uc3QgTUFYX1JFTE9BRFMgPSAxMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUlOID0gNTAwMFxuZXhwb3J0IGNvbnN0IFJFTE9BRF9KSVRURVJfTUFYID0gMTAwMDBcbmV4cG9ydCBjb25zdCBGQUlMU0FGRV9KSVRURVIgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IFBIWF9FVkVOVF9DTEFTU0VTID0gW1xuICBcInBoeC1jbGljay1sb2FkaW5nXCIsIFwicGh4LWNoYW5nZS1sb2FkaW5nXCIsIFwicGh4LXN1Ym1pdC1sb2FkaW5nXCIsXG4gIFwicGh4LWtleWRvd24tbG9hZGluZ1wiLCBcInBoeC1rZXl1cC1sb2FkaW5nXCIsIFwicGh4LWJsdXItbG9hZGluZ1wiLCBcInBoeC1mb2N1cy1sb2FkaW5nXCJcbl1cbmV4cG9ydCBjb25zdCBQSFhfQ09NUE9ORU5UID0gXCJkYXRhLXBoeC1jb21wb25lbnRcIlxuZXhwb3J0IGNvbnN0IFBIWF9MSVZFX0xJTksgPSBcImRhdGEtcGh4LWxpbmtcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19TVEFUSUMgPSBcInRyYWNrLXN0YXRpY1wiXG5leHBvcnQgY29uc3QgUEhYX0xJTktfU1RBVEUgPSBcImRhdGEtcGh4LWxpbmstc3RhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9SRUYgPSBcImRhdGEtcGh4LXJlZlwiXG5leHBvcnQgY29uc3QgUEhYX1JFRl9TUkMgPSBcImRhdGEtcGh4LXJlZi1zcmNcIlxuZXhwb3J0IGNvbnN0IFBIWF9UUkFDS19VUExPQURTID0gXCJ0cmFjay11cGxvYWRzXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBMT0FEX1JFRiA9IFwiZGF0YS1waHgtdXBsb2FkLXJlZlwiXG5leHBvcnQgY29uc3QgUEhYX1BSRUZMSUdIVEVEX1JFRlMgPSBcImRhdGEtcGh4LXByZWZsaWdodGVkLXJlZnNcIlxuZXhwb3J0IGNvbnN0IFBIWF9ET05FX1JFRlMgPSBcImRhdGEtcGh4LWRvbmUtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0RST1BfVEFSR0VUID0gXCJkcm9wLXRhcmdldFwiXG5leHBvcnQgY29uc3QgUEhYX0FDVElWRV9FTlRSWV9SRUZTID0gXCJkYXRhLXBoeC1hY3RpdmUtcmVmc1wiXG5leHBvcnQgY29uc3QgUEhYX0xJVkVfRklMRV9VUERBVEVEID0gXCJwaHg6bGl2ZS1maWxlOnVwZGF0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9TS0lQID0gXCJkYXRhLXBoeC1za2lwXCJcbmV4cG9ydCBjb25zdCBQSFhfUFJVTkUgPSBcImRhdGEtcGh4LXBydW5lXCJcbmV4cG9ydCBjb25zdCBQSFhfUEFHRV9MT0FESU5HID0gXCJwYWdlLWxvYWRpbmdcIlxuZXhwb3J0IGNvbnN0IFBIWF9DT05ORUNURURfQ0xBU1MgPSBcInBoeC1jb25uZWN0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNDT05ORUNURURfQ0xBU1MgPSBcInBoeC1sb2FkaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MgPSBcInBoeC1uby1mZWVkYmFja1wiXG5leHBvcnQgY29uc3QgUEhYX0VSUk9SX0NMQVNTID0gXCJwaHgtZXJyb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9QQVJFTlRfSUQgPSBcImRhdGEtcGh4LXBhcmVudC1pZFwiXG5leHBvcnQgY29uc3QgUEhYX01BSU4gPSBcImRhdGEtcGh4LW1haW5cIlxuZXhwb3J0IGNvbnN0IFBIWF9ST09UX0lEID0gXCJkYXRhLXBoeC1yb290LWlkXCJcbmV4cG9ydCBjb25zdCBQSFhfVFJJR0dFUl9BQ1RJT04gPSBcInRyaWdnZXItYWN0aW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfRkVFREJBQ0tfRk9SID0gXCJmZWVkYmFjay1mb3JcIlxuZXhwb3J0IGNvbnN0IFBIWF9IQVNfRk9DVVNFRCA9IFwicGh4LWhhcy1mb2N1c2VkXCJcbmV4cG9ydCBjb25zdCBGT0NVU0FCTEVfSU5QVVRTID0gW1widGV4dFwiLCBcInRleHRhcmVhXCIsIFwibnVtYmVyXCIsIFwiZW1haWxcIiwgXCJwYXNzd29yZFwiLCBcInNlYXJjaFwiLCBcInRlbFwiLCBcInVybFwiLCBcImRhdGVcIiwgXCJ0aW1lXCIsIFwiZGF0ZXRpbWUtbG9jYWxcIiwgXCJjb2xvclwiLCBcInJhbmdlXCJdXG5leHBvcnQgY29uc3QgQ0hFQ0tBQkxFX0lOUFVUUyA9IFtcImNoZWNrYm94XCIsIFwicmFkaW9cIl1cbmV4cG9ydCBjb25zdCBQSFhfSEFTX1NVQk1JVFRFRCA9IFwicGh4LWhhcy1zdWJtaXR0ZWRcIlxuZXhwb3J0IGNvbnN0IFBIWF9TRVNTSU9OID0gXCJkYXRhLXBoeC1zZXNzaW9uXCJcbmV4cG9ydCBjb25zdCBQSFhfVklFV19TRUxFQ1RPUiA9IGBbJHtQSFhfU0VTU0lPTn1dYFxuZXhwb3J0IGNvbnN0IFBIWF9TVElDS1kgPSBcImRhdGEtcGh4LXN0aWNreVwiXG5leHBvcnQgY29uc3QgUEhYX1NUQVRJQyA9IFwiZGF0YS1waHgtc3RhdGljXCJcbmV4cG9ydCBjb25zdCBQSFhfUkVBRE9OTFkgPSBcImRhdGEtcGh4LXJlYWRvbmx5XCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRUQgPSBcImRhdGEtcGh4LWRpc2FibGVkXCJcbmV4cG9ydCBjb25zdCBQSFhfRElTQUJMRV9XSVRIID0gXCJkaXNhYmxlLXdpdGhcIlxuZXhwb3J0IGNvbnN0IFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSA9IFwiZGF0YS1waHgtZGlzYWJsZS13aXRoLXJlc3RvcmVcIlxuZXhwb3J0IGNvbnN0IFBIWF9IT09LID0gXCJob29rXCJcbmV4cG9ydCBjb25zdCBQSFhfREVCT1VOQ0UgPSBcImRlYm91bmNlXCJcbmV4cG9ydCBjb25zdCBQSFhfVEhST1RUTEUgPSBcInRocm90dGxlXCJcbmV4cG9ydCBjb25zdCBQSFhfVVBEQVRFID0gXCJ1cGRhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9LRVkgPSBcImtleVwiXG5leHBvcnQgY29uc3QgUEhYX1BSSVZBVEUgPSBcInBoeFByaXZhdGVcIlxuZXhwb3J0IGNvbnN0IFBIWF9BVVRPX1JFQ09WRVIgPSBcImF1dG8tcmVjb3ZlclwiXG5leHBvcnQgY29uc3QgUEhYX0xWX0RFQlVHID0gXCJwaHg6bGl2ZS1zb2NrZXQ6ZGVidWdcIlxuZXhwb3J0IGNvbnN0IFBIWF9MVl9QUk9GSUxFID0gXCJwaHg6bGl2ZS1zb2NrZXQ6cHJvZmlsaW5nXCJcbmV4cG9ydCBjb25zdCBQSFhfTFZfTEFURU5DWV9TSU0gPSBcInBoeDpsaXZlLXNvY2tldDpsYXRlbmN5LXNpbVwiXG5leHBvcnQgY29uc3QgUEhYX1BST0dSRVNTID0gXCJwcm9ncmVzc1wiXG5leHBvcnQgY29uc3QgTE9BREVSX1RJTUVPVVQgPSAxXG5leHBvcnQgY29uc3QgQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVCA9IDIwMFxuZXhwb3J0IGNvbnN0IEJJTkRJTkdfUFJFRklYID0gXCJwaHgtXCJcbmV4cG9ydCBjb25zdCBQVVNIX1RJTUVPVVQgPSAzMDAwMFxuZXhwb3J0IGNvbnN0IExJTktfSEVBREVSID0gXCJ4LXJlcXVlc3RlZC13aXRoXCJcbmV4cG9ydCBjb25zdCBSRVNQT05TRV9VUkxfSEVBREVSID0gXCJ4LXJlc3BvbnNlLXVybFwiXG5leHBvcnQgY29uc3QgREVCT1VOQ0VfVFJJR0dFUiA9IFwiZGVib3VuY2UtdHJpZ2dlclwiXG5leHBvcnQgY29uc3QgVEhST1RUTEVEID0gXCJ0aHJvdHRsZWRcIlxuZXhwb3J0IGNvbnN0IERFQk9VTkNFX1BSRVZfS0VZID0gXCJkZWJvdW5jZS1wcmV2LWtleVwiXG5leHBvcnQgY29uc3QgREVGQVVMVFMgPSB7XG4gIGRlYm91bmNlOiAzMDAsXG4gIHRocm90dGxlOiAzMDBcbn1cblxuLy8gUmVuZGVyZWRcbmV4cG9ydCBjb25zdCBEWU5BTUlDUyA9IFwiZFwiXG5leHBvcnQgY29uc3QgU1RBVElDID0gXCJzXCJcbmV4cG9ydCBjb25zdCBDT01QT05FTlRTID0gXCJjXCJcbmV4cG9ydCBjb25zdCBFVkVOVFMgPSBcImVcIlxuZXhwb3J0IGNvbnN0IFJFUExZID0gXCJyXCJcbmV4cG9ydCBjb25zdCBUSVRMRSA9IFwidFwiXG5leHBvcnQgY29uc3QgVEVNUExBVEVTID0gXCJwXCJcbiIsICJpbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEVudHJ5VXBsb2FkZXIge1xuICBjb25zdHJ1Y3RvcihlbnRyeSwgY2h1bmtTaXplLCBsaXZlU29ja2V0KXtcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4gICAgdGhpcy5lbnRyeSA9IGVudHJ5XG4gICAgdGhpcy5vZmZzZXQgPSAwXG4gICAgdGhpcy5jaHVua1NpemUgPSBjaHVua1NpemVcbiAgICB0aGlzLmNodW5rVGltZXIgPSBudWxsXG4gICAgdGhpcy51cGxvYWRDaGFubmVsID0gbGl2ZVNvY2tldC5jaGFubmVsKGBsdnU6JHtlbnRyeS5yZWZ9YCwge3Rva2VuOiBlbnRyeS5tZXRhZGF0YSgpfSlcbiAgfVxuXG4gIGVycm9yKHJlYXNvbil7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMuY2h1bmtUaW1lcilcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwubGVhdmUoKVxuICAgIHRoaXMuZW50cnkuZXJyb3IocmVhc29uKVxuICB9XG5cbiAgdXBsb2FkKCl7XG4gICAgdGhpcy51cGxvYWRDaGFubmVsLm9uRXJyb3IocmVhc29uID0+IHRoaXMuZXJyb3IocmVhc29uKSlcbiAgICB0aGlzLnVwbG9hZENoYW5uZWwuam9pbigpXG4gICAgICAucmVjZWl2ZShcIm9rXCIsIF9kYXRhID0+IHRoaXMucmVhZE5leHRDaHVuaygpKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZWFzb24gPT4gdGhpcy5lcnJvcihyZWFzb24pKVxuICB9XG5cbiAgaXNEb25lKCl7IHJldHVybiB0aGlzLm9mZnNldCA+PSB0aGlzLmVudHJ5LmZpbGUuc2l6ZSB9XG5cbiAgcmVhZE5leHRDaHVuaygpe1xuICAgIGxldCByZWFkZXIgPSBuZXcgd2luZG93LkZpbGVSZWFkZXIoKVxuICAgIGxldCBibG9iID0gdGhpcy5lbnRyeS5maWxlLnNsaWNlKHRoaXMub2Zmc2V0LCB0aGlzLmNodW5rU2l6ZSArIHRoaXMub2Zmc2V0KVxuICAgIHJlYWRlci5vbmxvYWQgPSAoZSkgPT4ge1xuICAgICAgaWYoZS50YXJnZXQuZXJyb3IgPT09IG51bGwpe1xuICAgICAgICB0aGlzLm9mZnNldCArPSBlLnRhcmdldC5yZXN1bHQuYnl0ZUxlbmd0aFxuICAgICAgICB0aGlzLnB1c2hDaHVuayhlLnRhcmdldC5yZXN1bHQpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbG9nRXJyb3IoXCJSZWFkIGVycm9yOiBcIiArIGUudGFyZ2V0LmVycm9yKVxuICAgICAgfVxuICAgIH1cbiAgICByZWFkZXIucmVhZEFzQXJyYXlCdWZmZXIoYmxvYilcbiAgfVxuXG4gIHB1c2hDaHVuayhjaHVuayl7XG4gICAgaWYoIXRoaXMudXBsb2FkQ2hhbm5lbC5pc0pvaW5lZCgpKXsgcmV0dXJuIH1cbiAgICB0aGlzLnVwbG9hZENoYW5uZWwucHVzaChcImNodW5rXCIsIGNodW5rKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuZW50cnkucHJvZ3Jlc3MoKHRoaXMub2Zmc2V0IC8gdGhpcy5lbnRyeS5maWxlLnNpemUpICogMTAwKVxuICAgICAgICBpZighdGhpcy5pc0RvbmUoKSl7XG4gICAgICAgICAgdGhpcy5jaHVua1RpbWVyID0gc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlYWROZXh0Q2h1bmsoKSwgdGhpcy5saXZlU29ja2V0LmdldExhdGVuY3lTaW0oKSB8fCAwKVxuICAgICAgICB9XG4gICAgICB9KVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX1ZJRVdfU0VMRUNUT1Jcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IEVudHJ5VXBsb2FkZXIgZnJvbSBcIi4vZW50cnlfdXBsb2FkZXJcIlxuXG5leHBvcnQgbGV0IGxvZ0Vycm9yID0gKG1zZywgb2JqKSA9PiBjb25zb2xlLmVycm9yICYmIGNvbnNvbGUuZXJyb3IobXNnLCBvYmopXG5cbmV4cG9ydCBsZXQgaXNDaWQgPSAoY2lkKSA9PiB7XG4gIGxldCB0eXBlID0gdHlwZW9mKGNpZClcbiAgcmV0dXJuIHR5cGUgPT09IFwibnVtYmVyXCIgfHwgKHR5cGUgPT09IFwic3RyaW5nXCIgJiYgL14oMHxbMS05XVxcZCopJC8udGVzdChjaWQpKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZGV0ZWN0RHVwbGljYXRlSWRzKCl7XG4gIGxldCBpZHMgPSBuZXcgU2V0KClcbiAgbGV0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIipbaWRdXCIpXG4gIGZvcihsZXQgaSA9IDAsIGxlbiA9IGVsZW1zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKXtcbiAgICBpZihpZHMuaGFzKGVsZW1zW2ldLmlkKSl7XG4gICAgICBjb25zb2xlLmVycm9yKGBNdWx0aXBsZSBJRHMgZGV0ZWN0ZWQ6ICR7ZWxlbXNbaV0uaWR9LiBFbnN1cmUgdW5pcXVlIGVsZW1lbnQgaWRzLmApXG4gICAgfSBlbHNlIHtcbiAgICAgIGlkcy5hZGQoZWxlbXNbaV0uaWQpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBsZXQgZGVidWcgPSAodmlldywga2luZCwgbXNnLCBvYmopID0+IHtcbiAgaWYodmlldy5saXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpe1xuICAgIGNvbnNvbGUubG9nKGAke3ZpZXcuaWR9ICR7a2luZH06ICR7bXNnfSAtIGAsIG9iailcbiAgfVxufVxuXG4vLyB3cmFwcyB2YWx1ZSBpbiBjbG9zdXJlIG9yIHJldHVybnMgY2xvc3VyZVxuZXhwb3J0IGxldCBjbG9zdXJlID0gKHZhbCkgPT4gdHlwZW9mIHZhbCA9PT0gXCJmdW5jdGlvblwiID8gdmFsIDogZnVuY3Rpb24gKCl7IHJldHVybiB2YWwgfVxuXG5leHBvcnQgbGV0IGNsb25lID0gKG9iaikgPT4geyByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSB9XG5cbmV4cG9ydCBsZXQgY2xvc2VzdFBoeEJpbmRpbmcgPSAoZWwsIGJpbmRpbmcsIGJvcmRlckVsKSA9PiB7XG4gIGRvIHtcbiAgICBpZihlbC5tYXRjaGVzKGBbJHtiaW5kaW5nfV1gKSl7IHJldHVybiBlbCB9XG4gICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50IHx8IGVsLnBhcmVudE5vZGVcbiAgfSB3aGlsZShlbCAhPT0gbnVsbCAmJiBlbC5ub2RlVHlwZSA9PT0gMSAmJiAhKChib3JkZXJFbCAmJiBib3JkZXJFbC5pc1NhbWVOb2RlKGVsKSkgfHwgZWwubWF0Y2hlcyhQSFhfVklFV19TRUxFQ1RPUikpKVxuICByZXR1cm4gbnVsbFxufVxuXG5leHBvcnQgbGV0IGlzT2JqZWN0ID0gKG9iaikgPT4ge1xuICByZXR1cm4gb2JqICE9PSBudWxsICYmIHR5cGVvZiBvYmogPT09IFwib2JqZWN0XCIgJiYgIShvYmogaW5zdGFuY2VvZiBBcnJheSlcbn1cblxuZXhwb3J0IGxldCBpc0VxdWFsT2JqID0gKG9iajEsIG9iajIpID0+IEpTT04uc3RyaW5naWZ5KG9iajEpID09PSBKU09OLnN0cmluZ2lmeShvYmoyKVxuXG5leHBvcnQgbGV0IGlzRW1wdHkgPSAob2JqKSA9PiB7XG4gIGZvcihsZXQgeCBpbiBvYmopeyByZXR1cm4gZmFsc2UgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgbGV0IG1heWJlID0gKGVsLCBjYWxsYmFjaykgPT4gZWwgJiYgY2FsbGJhY2soZWwpXG5cbmV4cG9ydCBsZXQgY2hhbm5lbFVwbG9hZGVyID0gZnVuY3Rpb24gKGVudHJpZXMsIG9uRXJyb3IsIHJlc3AsIGxpdmVTb2NrZXQpe1xuICBlbnRyaWVzLmZvckVhY2goZW50cnkgPT4ge1xuICAgIGxldCBlbnRyeVVwbG9hZGVyID0gbmV3IEVudHJ5VXBsb2FkZXIoZW50cnksIHJlc3AuY29uZmlnLmNodW5rX3NpemUsIGxpdmVTb2NrZXQpXG4gICAgZW50cnlVcGxvYWRlci51cGxvYWQoKVxuICB9KVxufVxuIiwgImxldCBCcm93c2VyID0ge1xuICBjYW5QdXNoU3RhdGUoKXsgcmV0dXJuICh0eXBlb2YgKGhpc3RvcnkucHVzaFN0YXRlKSAhPT0gXCJ1bmRlZmluZWRcIikgfSxcblxuICBkcm9wTG9jYWwobG9jYWxTdG9yYWdlLCBuYW1lc3BhY2UsIHN1YmtleSl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKVxuICB9LFxuXG4gIHVwZGF0ZUxvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXksIGluaXRpYWwsIGZ1bmMpe1xuICAgIGxldCBjdXJyZW50ID0gdGhpcy5nZXRMb2NhbChsb2NhbFN0b3JhZ2UsIG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBrZXkgPSB0aGlzLmxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KVxuICAgIGxldCBuZXdWYWwgPSBjdXJyZW50ID09PSBudWxsID8gaW5pdGlhbCA6IGZ1bmMoY3VycmVudClcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksIEpTT04uc3RyaW5naWZ5KG5ld1ZhbCkpXG4gICAgcmV0dXJuIG5ld1ZhbFxuICB9LFxuXG4gIGdldExvY2FsKGxvY2FsU3RvcmFnZSwgbmFtZXNwYWNlLCBzdWJrZXkpe1xuICAgIHJldHVybiBKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKHRoaXMubG9jYWxLZXkobmFtZXNwYWNlLCBzdWJrZXkpKSlcbiAgfSxcblxuICB1cGRhdGVDdXJyZW50U3RhdGUoY2FsbGJhY2spe1xuICAgIGlmKCF0aGlzLmNhblB1c2hTdGF0ZSgpKXsgcmV0dXJuIH1cbiAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjYWxsYmFjayhoaXN0b3J5LnN0YXRlIHx8IHt9KSwgXCJcIiwgd2luZG93LmxvY2F0aW9uLmhyZWYpXG4gIH0sXG5cbiAgcHVzaFN0YXRlKGtpbmQsIG1ldGEsIHRvKXtcbiAgICBpZih0aGlzLmNhblB1c2hTdGF0ZSgpKXtcbiAgICAgIGlmKHRvICE9PSB3aW5kb3cubG9jYXRpb24uaHJlZil7XG4gICAgICAgIGlmKG1ldGEudHlwZSA9PSBcInJlZGlyZWN0XCIgJiYgbWV0YS5zY3JvbGwpe1xuICAgICAgICAgIC8vIElmIHdlJ3JlIHJlZGlyZWN0aW5nIHN0b3JlIHRoZSBjdXJyZW50IHNjcm9sbFkgZm9yIHRoZSBjdXJyZW50IGhpc3Rvcnkgc3RhdGUuXG4gICAgICAgICAgbGV0IGN1cnJlbnRTdGF0ZSA9IGhpc3Rvcnkuc3RhdGUgfHwge31cbiAgICAgICAgICBjdXJyZW50U3RhdGUuc2Nyb2xsID0gbWV0YS5zY3JvbGxcbiAgICAgICAgICBoaXN0b3J5LnJlcGxhY2VTdGF0ZShjdXJyZW50U3RhdGUsIFwiXCIsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKVxuICAgICAgICB9XG5cbiAgICAgICAgZGVsZXRlIG1ldGEuc2Nyb2xsIC8vIE9ubHkgc3RvcmUgdGhlIHNjcm9sbCBpbiB0aGUgcmVkaXJlY3QgY2FzZS5cbiAgICAgICAgaGlzdG9yeVtraW5kICsgXCJTdGF0ZVwiXShtZXRhLCBcIlwiLCB0byB8fCBudWxsKSAvLyBJRSB3aWxsIGNvZXJjZSB1bmRlZmluZWQgdG8gc3RyaW5nXG4gICAgICAgIGxldCBoYXNoRWwgPSB0aGlzLmdldEhhc2hUYXJnZXRFbCh3aW5kb3cubG9jYXRpb24uaGFzaClcblxuICAgICAgICBpZihoYXNoRWwpe1xuICAgICAgICAgIGhhc2hFbC5zY3JvbGxJbnRvVmlldygpXG4gICAgICAgIH0gZWxzZSBpZihtZXRhLnR5cGUgPT09IFwicmVkaXJlY3RcIil7XG4gICAgICAgICAgd2luZG93LnNjcm9sbCgwLCAwKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVkaXJlY3QodG8pXG4gICAgfVxuICB9LFxuXG4gIHNldENvb2tpZShuYW1lLCB2YWx1ZSl7XG4gICAgZG9jdW1lbnQuY29va2llID0gYCR7bmFtZX09JHt2YWx1ZX1gXG4gIH0sXG5cbiAgZ2V0Q29va2llKG5hbWUpe1xuICAgIHJldHVybiBkb2N1bWVudC5jb29raWUucmVwbGFjZShuZXcgUmVnRXhwKGAoPzooPzpefC4qO1xccyopJHtuYW1lfVxccypcXD1cXHMqKFteO10qKS4qJCl8Xi4qJGApLCBcIiQxXCIpXG4gIH0sXG5cbiAgcmVkaXJlY3QodG9VUkwsIGZsYXNoKXtcbiAgICBpZihmbGFzaCl7IEJyb3dzZXIuc2V0Q29va2llKFwiX19waG9lbml4X2ZsYXNoX19cIiwgZmxhc2ggKyBcIjsgbWF4LWFnZT02MDAwMDsgcGF0aD0vXCIpIH1cbiAgICB3aW5kb3cubG9jYXRpb24gPSB0b1VSTFxuICB9LFxuXG4gIGxvY2FsS2V5KG5hbWVzcGFjZSwgc3Via2V5KXsgcmV0dXJuIGAke25hbWVzcGFjZX0tJHtzdWJrZXl9YCB9LFxuXG4gIGdldEhhc2hUYXJnZXRFbChtYXliZUhhc2gpe1xuICAgIGxldCBoYXNoID0gbWF5YmVIYXNoLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDEpXG4gICAgaWYoaGFzaCA9PT0gXCJcIil7IHJldHVybiB9XG4gICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2gpIHx8IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYGFbbmFtZT1cIiR7aGFzaH1cIl1gKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEJyb3dzZXJcbiIsICJpbXBvcnQge1xuICBDSEVDS0FCTEVfSU5QVVRTLFxuICBERUJPVU5DRV9QUkVWX0tFWSxcbiAgREVCT1VOQ0VfVFJJR0dFUixcbiAgRk9DVVNBQkxFX0lOUFVUUyxcbiAgUEhYX0NPTVBPTkVOVCxcbiAgUEhYX0VWRU5UX0NMQVNTRVMsXG4gIFBIWF9IQVNfRk9DVVNFRCxcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9NQUlOLFxuICBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MsXG4gIFBIWF9QQVJFTlRfSUQsXG4gIFBIWF9QUklWQVRFLFxuICBQSFhfUkVGLFxuICBQSFhfUkVGX1NSQyxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU1RBVElDLFxuICBQSFhfVVBMT0FEX1JFRixcbiAgUEhYX1ZJRVdfU0VMRUNUT1IsXG4gIFBIWF9TVElDS1ksXG4gIFRIUk9UVExFRFxufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBsb2dFcnJvclxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmxldCBET00gPSB7XG4gIGJ5SWQoaWQpeyByZXR1cm4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpIHx8IGxvZ0Vycm9yKGBubyBpZCBmb3VuZCBmb3IgJHtpZH1gKSB9LFxuXG4gIHJlbW92ZUNsYXNzKGVsLCBjbGFzc05hbWUpe1xuICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKVxuICAgIGlmKGVsLmNsYXNzTGlzdC5sZW5ndGggPT09IDApeyBlbC5yZW1vdmVBdHRyaWJ1dGUoXCJjbGFzc1wiKSB9XG4gIH0sXG5cbiAgYWxsKG5vZGUsIHF1ZXJ5LCBjYWxsYmFjayl7XG4gICAgaWYoIW5vZGUpeyByZXR1cm4gW10gfVxuICAgIGxldCBhcnJheSA9IEFycmF5LmZyb20obm9kZS5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KSlcbiAgICByZXR1cm4gY2FsbGJhY2sgPyBhcnJheS5mb3JFYWNoKGNhbGxiYWNrKSA6IGFycmF5XG4gIH0sXG5cbiAgY2hpbGROb2RlTGVuZ3RoKGh0bWwpe1xuICAgIGxldCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IGh0bWxcbiAgICByZXR1cm4gdGVtcGxhdGUuY29udGVudC5jaGlsZEVsZW1lbnRDb3VudFxuICB9LFxuXG4gIGlzVXBsb2FkSW5wdXQoZWwpeyByZXR1cm4gZWwudHlwZSA9PT0gXCJmaWxlXCIgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSAhPT0gbnVsbCB9LFxuXG4gIGZpbmRVcGxvYWRJbnB1dHMobm9kZSl7IHJldHVybiB0aGlzLmFsbChub2RlLCBgaW5wdXRbdHlwZT1cImZpbGVcIl1bJHtQSFhfVVBMT0FEX1JFRn1dYCkgfSxcblxuICBmaW5kQ29tcG9uZW50Tm9kZUxpc3Qobm9kZSwgY2lkKXtcbiAgICByZXR1cm4gdGhpcy5maWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcodGhpcy5hbGwobm9kZSwgYFske1BIWF9DT01QT05FTlR9PVwiJHtjaWR9XCJdYCksIG5vZGUpXG4gIH0sXG5cbiAgaXNQaHhEZXN0cm95ZWQobm9kZSl7XG4gICAgcmV0dXJuIG5vZGUuaWQgJiYgRE9NLnByaXZhdGUobm9kZSwgXCJkZXN0cm95ZWRcIikgPyB0cnVlIDogZmFsc2VcbiAgfSxcblxuICBtYXJrUGh4Q2hpbGREZXN0cm95ZWQoZWwpe1xuICAgIGlmKHRoaXMuaXNQaHhDaGlsZChlbCkpeyBlbC5zZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04sIFwiXCIpIH1cbiAgICB0aGlzLnB1dFByaXZhdGUoZWwsIFwiZGVzdHJveWVkXCIsIHRydWUpXG4gIH0sXG5cbiAgZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCBwYXJlbnRJZCl7XG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gaHRtbFxuICAgIHJldHVybiB0aGlzLmZpbmRQaHhDaGlsZHJlbih0ZW1wbGF0ZS5jb250ZW50LCBwYXJlbnRJZClcbiAgfSxcblxuICBpc0lnbm9yZWQoZWwsIHBoeFVwZGF0ZSl7XG4gICAgcmV0dXJuIChlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSB8fCBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC11cGRhdGVcIikpID09PSBcImlnbm9yZVwiXG4gIH0sXG5cbiAgaXNQaHhVcGRhdGUoZWwsIHBoeFVwZGF0ZSwgdXBkYXRlVHlwZXMpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgdXBkYXRlVHlwZXMuaW5kZXhPZihlbC5nZXRBdHRyaWJ1dGUocGh4VXBkYXRlKSkgPj0gMFxuICB9LFxuXG4gIGZpbmRQaHhTdGlja3koZWwpeyByZXR1cm4gdGhpcy5hbGwoZWwsIGBbJHtQSFhfU1RJQ0tZfV1gKSB9LFxuXG4gIGZpbmRQaHhDaGlsZHJlbihlbCwgcGFyZW50SWQpe1xuICAgIHJldHVybiB0aGlzLmFsbChlbCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9WyR7UEhYX1BBUkVOVF9JRH09XCIke3BhcmVudElkfVwiXWApXG4gIH0sXG5cbiAgZmluZFBhcmVudENJRHMobm9kZSwgY2lkcyl7XG4gICAgbGV0IGluaXRpYWwgPSBuZXcgU2V0KGNpZHMpXG4gICAgcmV0dXJuIGNpZHMucmVkdWNlKChhY2MsIGNpZCkgPT4ge1xuICAgICAgbGV0IHNlbGVjdG9yID0gYFske1BIWF9DT01QT05FTlR9PVwiJHtjaWR9XCJdIFske1BIWF9DT01QT05FTlR9XWBcblxuICAgICAgdGhpcy5maWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcodGhpcy5hbGwobm9kZSwgc2VsZWN0b3IpLCBub2RlKVxuICAgICAgICAubWFwKGVsID0+IHBhcnNlSW50KGVsLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSkpXG4gICAgICAgIC5mb3JFYWNoKGNoaWxkQ0lEID0+IGFjYy5kZWxldGUoY2hpbGRDSUQpKVxuXG4gICAgICByZXR1cm4gYWNjXG4gICAgfSwgaW5pdGlhbClcbiAgfSxcblxuICBmaWx0ZXJXaXRoaW5TYW1lTGl2ZVZpZXcobm9kZXMsIHBhcmVudCl7XG4gICAgaWYocGFyZW50LnF1ZXJ5U2VsZWN0b3IoUEhYX1ZJRVdfU0VMRUNUT1IpKXtcbiAgICAgIHJldHVybiBub2Rlcy5maWx0ZXIoZWwgPT4gdGhpcy53aXRoaW5TYW1lTGl2ZVZpZXcoZWwsIHBhcmVudCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBub2Rlc1xuICAgIH1cbiAgfSxcblxuICB3aXRoaW5TYW1lTGl2ZVZpZXcobm9kZSwgcGFyZW50KXtcbiAgICB3aGlsZShub2RlID0gbm9kZS5wYXJlbnROb2RlKXtcbiAgICAgIGlmKG5vZGUuaXNTYW1lTm9kZShwYXJlbnQpKXsgcmV0dXJuIHRydWUgfVxuICAgICAgaWYobm9kZS5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pICE9PSBudWxsKXsgcmV0dXJuIGZhbHNlIH1cbiAgICB9XG4gIH0sXG5cbiAgcHJpdmF0ZShlbCwga2V5KXsgcmV0dXJuIGVsW1BIWF9QUklWQVRFXSAmJiBlbFtQSFhfUFJJVkFURV1ba2V5XSB9LFxuXG4gIGRlbGV0ZVByaXZhdGUoZWwsIGtleSl7IGVsW1BIWF9QUklWQVRFXSAmJiBkZWxldGUgKGVsW1BIWF9QUklWQVRFXVtrZXldKSB9LFxuXG4gIHB1dFByaXZhdGUoZWwsIGtleSwgdmFsdWUpe1xuICAgIGlmKCFlbFtQSFhfUFJJVkFURV0peyBlbFtQSFhfUFJJVkFURV0gPSB7fSB9XG4gICAgZWxbUEhYX1BSSVZBVEVdW2tleV0gPSB2YWx1ZVxuICB9LFxuXG4gIHVwZGF0ZVByaXZhdGUoZWwsIGtleSwgZGVmYXVsdFZhbCwgdXBkYXRlRnVuYyl7XG4gICAgbGV0IGV4aXN0aW5nID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpXG4gICAgaWYoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCl7XG4gICAgICB0aGlzLnB1dFByaXZhdGUoZWwsIGtleSwgdXBkYXRlRnVuYyhkZWZhdWx0VmFsKSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHVwZGF0ZUZ1bmMoZXhpc3RpbmcpKVxuICAgIH1cbiAgfSxcblxuICBjb3B5UHJpdmF0ZXModGFyZ2V0LCBzb3VyY2Upe1xuICAgIGlmKHNvdXJjZVtQSFhfUFJJVkFURV0pe1xuICAgICAgdGFyZ2V0W1BIWF9QUklWQVRFXSA9IHNvdXJjZVtQSFhfUFJJVkFURV1cbiAgICB9XG4gIH0sXG5cbiAgcHV0VGl0bGUoc3RyKXtcbiAgICBsZXQgdGl0bGVFbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJ0aXRsZVwiKVxuICAgIGxldCB7cHJlZml4LCBzdWZmaXh9ID0gdGl0bGVFbC5kYXRhc2V0XG4gICAgZG9jdW1lbnQudGl0bGUgPSBgJHtwcmVmaXggfHwgXCJcIn0ke3N0cn0ke3N1ZmZpeCB8fCBcIlwifWBcbiAgfSxcblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIHBoeERlYm91bmNlLCBkZWZhdWx0RGVib3VuY2UsIHBoeFRocm90dGxlLCBkZWZhdWx0VGhyb3R0bGUsIGFzeW5jRmlsdGVyLCBjYWxsYmFjayl7XG4gICAgbGV0IGRlYm91bmNlID0gZWwuZ2V0QXR0cmlidXRlKHBoeERlYm91bmNlKVxuICAgIGxldCB0aHJvdHRsZSA9IGVsLmdldEF0dHJpYnV0ZShwaHhUaHJvdHRsZSlcbiAgICBpZihkZWJvdW5jZSA9PT0gXCJcIil7IGRlYm91bmNlID0gZGVmYXVsdERlYm91bmNlIH1cbiAgICBpZih0aHJvdHRsZSA9PT0gXCJcIil7IHRocm90dGxlID0gZGVmYXVsdFRocm90dGxlIH1cbiAgICBsZXQgdmFsdWUgPSBkZWJvdW5jZSB8fCB0aHJvdHRsZVxuICAgIHN3aXRjaCh2YWx1ZSl7XG4gICAgICBjYXNlIG51bGw6IHJldHVybiBjYWxsYmFjaygpXG5cbiAgICAgIGNhc2UgXCJibHVyXCI6XG4gICAgICAgIGlmKHRoaXMub25jZShlbCwgXCJkZWJvdW5jZS1ibHVyXCIpKXtcbiAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKFwiYmx1clwiLCAoKSA9PiBjYWxsYmFjaygpKVxuICAgICAgICB9XG4gICAgICAgIHJldHVyblxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBsZXQgdGltZW91dCA9IHBhcnNlSW50KHZhbHVlKVxuICAgICAgICBsZXQgdHJpZ2dlciA9ICgpID0+IHRocm90dGxlID8gdGhpcy5kZWxldGVQcml2YXRlKGVsLCBUSFJPVFRMRUQpIDogY2FsbGJhY2soKVxuICAgICAgICBsZXQgY3VycmVudEN5Y2xlID0gdGhpcy5pbmNDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUiwgdHJpZ2dlcilcbiAgICAgICAgaWYoaXNOYU4odGltZW91dCkpeyByZXR1cm4gbG9nRXJyb3IoYGludmFsaWQgdGhyb3R0bGUvZGVib3VuY2UgdmFsdWU6ICR7dmFsdWV9YCkgfVxuICAgICAgICBpZih0aHJvdHRsZSl7XG4gICAgICAgICAgbGV0IG5ld0tleURvd24gPSBmYWxzZVxuICAgICAgICAgIGlmKGV2ZW50LnR5cGUgPT09IFwia2V5ZG93blwiKXtcbiAgICAgICAgICAgIGxldCBwcmV2S2V5ID0gdGhpcy5wcml2YXRlKGVsLCBERUJPVU5DRV9QUkVWX0tFWSlcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgREVCT1VOQ0VfUFJFVl9LRVksIGV2ZW50LmtleSlcbiAgICAgICAgICAgIG5ld0tleURvd24gPSBwcmV2S2V5ICE9PSBldmVudC5rZXlcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZighbmV3S2V5RG93biAmJiB0aGlzLnByaXZhdGUoZWwsIFRIUk9UVExFRCkpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgICAgIHRoaXMucHV0UHJpdmF0ZShlbCwgVEhST1RUTEVELCB0cnVlKVxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgIGlmKGFzeW5jRmlsdGVyKCkpeyB0aGlzLnRyaWdnZXJDeWNsZShlbCwgREVCT1VOQ0VfVFJJR0dFUikgfVxuICAgICAgICAgICAgfSwgdGltZW91dClcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICBpZihhc3luY0ZpbHRlcigpKXsgdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIsIGN1cnJlbnRDeWNsZSkgfVxuICAgICAgICAgIH0sIHRpbWVvdXQpXG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZm9ybSA9IGVsLmZvcm1cbiAgICAgICAgaWYoZm9ybSAmJiB0aGlzLm9uY2UoZm9ybSwgXCJiaW5kLWRlYm91bmNlXCIpKXtcbiAgICAgICAgICBmb3JtLmFkZEV2ZW50TGlzdGVuZXIoXCJzdWJtaXRcIiwgKCkgPT4ge1xuICAgICAgICAgICAgQXJyYXkuZnJvbSgobmV3IEZvcm1EYXRhKGZvcm0pKS5lbnRyaWVzKCksIChbbmFtZV0pID0+IHtcbiAgICAgICAgICAgICAgbGV0IGlucHV0ID0gZm9ybS5xdWVyeVNlbGVjdG9yKGBbbmFtZT1cIiR7bmFtZX1cIl1gKVxuICAgICAgICAgICAgICB0aGlzLmluY0N5Y2xlKGlucHV0LCBERUJPVU5DRV9UUklHR0VSKVxuICAgICAgICAgICAgICB0aGlzLmRlbGV0ZVByaXZhdGUoaW5wdXQsIFRIUk9UVExFRClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgICBpZih0aGlzLm9uY2UoZWwsIFwiYmluZC1kZWJvdW5jZVwiKSl7XG4gICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihcImJsdXJcIiwgKCkgPT4gdGhpcy50cmlnZ2VyQ3ljbGUoZWwsIERFQk9VTkNFX1RSSUdHRVIpKVxuICAgICAgICB9XG4gICAgfVxuICB9LFxuXG4gIHRyaWdnZXJDeWNsZShlbCwga2V5LCBjdXJyZW50Q3ljbGUpe1xuICAgIGxldCBbY3ljbGUsIHRyaWdnZXJdID0gdGhpcy5wcml2YXRlKGVsLCBrZXkpXG4gICAgaWYoIWN1cnJlbnRDeWNsZSl7IGN1cnJlbnRDeWNsZSA9IGN5Y2xlIH1cbiAgICBpZihjdXJyZW50Q3ljbGUgPT09IGN5Y2xlKXtcbiAgICAgIHRoaXMuaW5jQ3ljbGUoZWwsIGtleSlcbiAgICAgIHRyaWdnZXIoKVxuICAgIH1cbiAgfSxcblxuICBvbmNlKGVsLCBrZXkpe1xuICAgIGlmKHRoaXMucHJpdmF0ZShlbCwga2V5KSA9PT0gdHJ1ZSl7IHJldHVybiBmYWxzZSB9XG4gICAgdGhpcy5wdXRQcml2YXRlKGVsLCBrZXksIHRydWUpXG4gICAgcmV0dXJuIHRydWVcbiAgfSxcblxuICBpbmNDeWNsZShlbCwga2V5LCB0cmlnZ2VyID0gZnVuY3Rpb24gKCl7IH0pe1xuICAgIGxldCBbY3VycmVudEN5Y2xlXSA9IHRoaXMucHJpdmF0ZShlbCwga2V5KSB8fCBbMCwgdHJpZ2dlcl1cbiAgICBjdXJyZW50Q3ljbGUrK1xuICAgIHRoaXMucHV0UHJpdmF0ZShlbCwga2V5LCBbY3VycmVudEN5Y2xlLCB0cmlnZ2VyXSlcbiAgICByZXR1cm4gY3VycmVudEN5Y2xlXG4gIH0sXG5cbiAgZGlzY2FyZEVycm9yKGNvbnRhaW5lciwgZWwsIHBoeEZlZWRiYWNrRm9yKXtcbiAgICBsZXQgZmllbGQgPSBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeEZlZWRiYWNrRm9yKVxuICAgIC8vIFRPRE86IFJlbW92ZSBpZCBsb29rdXAgYWZ0ZXIgd2UgdXBkYXRlIFBob2VuaXggdG8gdXNlIGlucHV0X25hbWUgaW5zdGVhZCBvZiBpbnB1dF9pZFxuICAgIGxldCBpbnB1dCA9IGZpZWxkICYmIGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKGBbaWQ9XCIke2ZpZWxkfVwiXSwgW25hbWU9XCIke2ZpZWxkfVwiXWApXG4gICAgaWYoIWlucHV0KXsgcmV0dXJuIH1cblxuICAgIGlmKCEodGhpcy5wcml2YXRlKGlucHV0LCBQSFhfSEFTX0ZPQ1VTRUQpIHx8IHRoaXMucHJpdmF0ZShpbnB1dC5mb3JtLCBQSFhfSEFTX1NVQk1JVFRFRCkpKXtcbiAgICAgIGVsLmNsYXNzTGlzdC5hZGQoUEhYX05PX0ZFRURCQUNLX0NMQVNTKVxuICAgIH1cbiAgfSxcblxuICBzaG93RXJyb3IoaW5wdXRFbCwgcGh4RmVlZGJhY2tGb3Ipe1xuICAgIGlmKGlucHV0RWwuaWQgfHwgaW5wdXRFbC5uYW1lKXtcbiAgICAgIHRoaXMuYWxsKGlucHV0RWwuZm9ybSwgYFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5pZH1cIl0sIFske3BoeEZlZWRiYWNrRm9yfT1cIiR7aW5wdXRFbC5uYW1lfVwiXWAsIChlbCkgPT4ge1xuICAgICAgICB0aGlzLnJlbW92ZUNsYXNzKGVsLCBQSFhfTk9fRkVFREJBQ0tfQ0xBU1MpXG4gICAgICB9KVxuICAgIH1cbiAgfSxcblxuICBpc1BoeENoaWxkKG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKVxuICB9LFxuXG4gIGlzUGh4U3RpY2t5KG5vZGUpe1xuICAgIHJldHVybiBub2RlLmdldEF0dHJpYnV0ZSAmJiBub2RlLmdldEF0dHJpYnV0ZShQSFhfU1RJQ0tZKSAhPT0gbnVsbFxuICB9LFxuXG4gIGZpcnN0UGh4Q2hpbGQoZWwpe1xuICAgIHJldHVybiB0aGlzLmlzUGh4Q2hpbGQoZWwpID8gZWwgOiB0aGlzLmFsbChlbCwgYFske1BIWF9QQVJFTlRfSUR9XWApWzBdXG4gIH0sXG5cbiAgZGlzcGF0Y2hFdmVudCh0YXJnZXQsIG5hbWUsIG9wdHMgPSB7fSl7XG4gICAgbGV0IGJ1YmJsZXMgPSBvcHRzLmJ1YmJsZXMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIW9wdHMuYnViYmxlc1xuICAgIGxldCBldmVudE9wdHMgPSB7YnViYmxlczogYnViYmxlcywgY2FuY2VsYWJsZTogdHJ1ZSwgZGV0YWlsOiBvcHRzLmRldGFpbCB8fCB7fX1cbiAgICBsZXQgZXZlbnQgPSBuYW1lID09PSBcImNsaWNrXCIgPyBuZXcgTW91c2VFdmVudChcImNsaWNrXCIsIGV2ZW50T3B0cykgOiBuZXcgQ3VzdG9tRXZlbnQobmFtZSwgZXZlbnRPcHRzKVxuICAgIHRhcmdldC5kaXNwYXRjaEV2ZW50KGV2ZW50KVxuICB9LFxuXG4gIGNsb25lTm9kZShub2RlLCBodG1sKXtcbiAgICBpZih0eXBlb2YgKGh0bWwpID09PSBcInVuZGVmaW5lZFwiKXtcbiAgICAgIHJldHVybiBub2RlLmNsb25lTm9kZSh0cnVlKVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY2xvbmVkID0gbm9kZS5jbG9uZU5vZGUoZmFsc2UpXG4gICAgICBjbG9uZWQuaW5uZXJIVE1MID0gaHRtbFxuICAgICAgcmV0dXJuIGNsb25lZFxuICAgIH1cbiAgfSxcblxuICBtZXJnZUF0dHJzKHRhcmdldCwgc291cmNlLCBvcHRzID0ge30pe1xuICAgIGxldCBleGNsdWRlID0gb3B0cy5leGNsdWRlIHx8IFtdXG4gICAgbGV0IGlzSWdub3JlZCA9IG9wdHMuaXNJZ25vcmVkXG4gICAgbGV0IHNvdXJjZUF0dHJzID0gc291cmNlLmF0dHJpYnV0ZXNcbiAgICBmb3IobGV0IGkgPSBzb3VyY2VBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSl7XG4gICAgICBsZXQgbmFtZSA9IHNvdXJjZUF0dHJzW2ldLm5hbWVcbiAgICAgIGlmKGV4Y2x1ZGUuaW5kZXhPZihuYW1lKSA8IDApeyB0YXJnZXQuc2V0QXR0cmlidXRlKG5hbWUsIHNvdXJjZS5nZXRBdHRyaWJ1dGUobmFtZSkpIH1cbiAgICB9XG5cbiAgICBsZXQgdGFyZ2V0QXR0cnMgPSB0YXJnZXQuYXR0cmlidXRlc1xuICAgIGZvcihsZXQgaSA9IHRhcmdldEF0dHJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKXtcbiAgICAgIGxldCBuYW1lID0gdGFyZ2V0QXR0cnNbaV0ubmFtZVxuICAgICAgaWYoaXNJZ25vcmVkKXtcbiAgICAgICAgaWYobmFtZS5zdGFydHNXaXRoKFwiZGF0YS1cIikgJiYgIXNvdXJjZS5oYXNBdHRyaWJ1dGUobmFtZSkpeyB0YXJnZXQucmVtb3ZlQXR0cmlidXRlKG5hbWUpIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmKCFzb3VyY2UuaGFzQXR0cmlidXRlKG5hbWUpKXsgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShuYW1lKSB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIG1lcmdlRm9jdXNlZElucHV0KHRhcmdldCwgc291cmNlKXtcbiAgICAvLyBza2lwIHNlbGVjdHMgYmVjYXVzZSBGRiB3aWxsIHJlc2V0IGhpZ2hsaWdodGVkIGluZGV4IGZvciBhbnkgc2V0QXR0cmlidXRlXG4gICAgaWYoISh0YXJnZXQgaW5zdGFuY2VvZiBIVE1MU2VsZWN0RWxlbWVudCkpeyBET00ubWVyZ2VBdHRycyh0YXJnZXQsIHNvdXJjZSwge2V4Y2x1ZGU6IFtcInZhbHVlXCJdfSkgfVxuICAgIGlmKHNvdXJjZS5yZWFkT25seSl7XG4gICAgICB0YXJnZXQuc2V0QXR0cmlidXRlKFwicmVhZG9ubHlcIiwgdHJ1ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpXG4gICAgfVxuICB9LFxuXG4gIGhhc1NlbGVjdGlvblJhbmdlKGVsKXtcbiAgICByZXR1cm4gZWwuc2V0U2VsZWN0aW9uUmFuZ2UgJiYgKGVsLnR5cGUgPT09IFwidGV4dFwiIHx8IGVsLnR5cGUgPT09IFwidGV4dGFyZWFcIilcbiAgfSxcblxuICByZXN0b3JlRm9jdXMoZm9jdXNlZCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCl7XG4gICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChmb2N1c2VkKSl7IHJldHVybiB9XG4gICAgbGV0IHdhc0ZvY3VzZWQgPSBmb2N1c2VkLm1hdGNoZXMoXCI6Zm9jdXNcIilcbiAgICBpZihmb2N1c2VkLnJlYWRPbmx5KXsgZm9jdXNlZC5ibHVyKCkgfVxuICAgIGlmKCF3YXNGb2N1c2VkKXsgZm9jdXNlZC5mb2N1cygpIH1cbiAgICBpZih0aGlzLmhhc1NlbGVjdGlvblJhbmdlKGZvY3VzZWQpKXtcbiAgICAgIGZvY3VzZWQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZClcbiAgICB9XG4gIH0sXG5cbiAgaXNGb3JtSW5wdXQoZWwpeyByZXR1cm4gL14oPzppbnB1dHxzZWxlY3R8dGV4dGFyZWEpJC9pLnRlc3QoZWwudGFnTmFtZSkgJiYgZWwudHlwZSAhPT0gXCJidXR0b25cIiB9LFxuXG4gIHN5bmNBdHRyc1RvUHJvcHMoZWwpe1xuICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCAmJiBDSEVDS0FCTEVfSU5QVVRTLmluZGV4T2YoZWwudHlwZS50b0xvY2FsZUxvd2VyQ2FzZSgpKSA+PSAwKXtcbiAgICAgIGVsLmNoZWNrZWQgPSBlbC5nZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIpICE9PSBudWxsXG4gICAgfVxuICB9LFxuXG4gIGlzVGV4dHVhbElucHV0KGVsKXsgcmV0dXJuIEZPQ1VTQUJMRV9JTlBVVFMuaW5kZXhPZihlbC50eXBlKSA+PSAwIH0sXG5cbiAgaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKHBoeFRyaWdnZXJFeHRlcm5hbCkgIT09IG51bGxcbiAgfSxcblxuICBzeW5jUGVuZGluZ1JlZihmcm9tRWwsIHRvRWwsIGRpc2FibGVXaXRoKXtcbiAgICBsZXQgcmVmID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfUkVGKVxuICAgIGlmKHJlZiA9PT0gbnVsbCl7IHJldHVybiB0cnVlIH1cbiAgICBsZXQgcmVmU3JjID0gZnJvbUVsLmdldEF0dHJpYnV0ZShQSFhfUkVGX1NSQylcblxuICAgIGlmKERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpIHx8IGZyb21FbC5nZXRBdHRyaWJ1dGUoZGlzYWJsZVdpdGgpICE9PSBudWxsKXtcbiAgICAgIGlmKERPTS5pc1VwbG9hZElucHV0KGZyb21FbCkpeyBET00ubWVyZ2VBdHRycyhmcm9tRWwsIHRvRWwsIHtpc0lnbm9yZWQ6IHRydWV9KSB9XG4gICAgICBET00ucHV0UHJpdmF0ZShmcm9tRWwsIFBIWF9SRUYsIHRvRWwpXG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgUEhYX0VWRU5UX0NMQVNTRVMuZm9yRWFjaChjbGFzc05hbWUgPT4ge1xuICAgICAgICBmcm9tRWwuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkgJiYgdG9FbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSlcbiAgICAgIH0pXG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShQSFhfUkVGLCByZWYpXG4gICAgICB0b0VsLnNldEF0dHJpYnV0ZShQSFhfUkVGX1NSQywgcmVmU3JjKVxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH0sXG5cbiAgY2xlYW5DaGlsZE5vZGVzKGNvbnRhaW5lciwgcGh4VXBkYXRlKXtcbiAgICBpZihET00uaXNQaHhVcGRhdGUoY29udGFpbmVyLCBwaHhVcGRhdGUsIFtcImFwcGVuZFwiLCBcInByZXBlbmRcIl0pKXtcbiAgICAgIGxldCB0b1JlbW92ZSA9IFtdXG4gICAgICBjb250YWluZXIuY2hpbGROb2Rlcy5mb3JFYWNoKGNoaWxkTm9kZSA9PiB7XG4gICAgICAgIGlmKCFjaGlsZE5vZGUuaWQpe1xuICAgICAgICAgIC8vIFNraXAgd2FybmluZyBpZiBpdCdzIGFuIGVtcHR5IHRleHQgbm9kZSAoZS5nLiBhIG5ldy1saW5lKVxuICAgICAgICAgIGxldCBpc0VtcHR5VGV4dE5vZGUgPSBjaGlsZE5vZGUubm9kZVR5cGUgPT09IE5vZGUuVEVYVF9OT0RFICYmIGNoaWxkTm9kZS5ub2RlVmFsdWUudHJpbSgpID09PSBcIlwiXG4gICAgICAgICAgaWYoIWlzRW1wdHlUZXh0Tm9kZSl7XG4gICAgICAgICAgICBsb2dFcnJvcihcIm9ubHkgSFRNTCBlbGVtZW50IHRhZ3Mgd2l0aCBhbiBpZCBhcmUgYWxsb3dlZCBpbnNpZGUgY29udGFpbmVycyB3aXRoIHBoeC11cGRhdGUuXFxuXFxuXCIgK1xuICAgICAgICAgICAgICBgcmVtb3ZpbmcgaWxsZWdhbCBub2RlOiBcIiR7KGNoaWxkTm9kZS5vdXRlckhUTUwgfHwgY2hpbGROb2RlLm5vZGVWYWx1ZSkudHJpbSgpfVwiXFxuXFxuYClcbiAgICAgICAgICB9XG4gICAgICAgICAgdG9SZW1vdmUucHVzaChjaGlsZE5vZGUpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKGNoaWxkTm9kZSA9PiBjaGlsZE5vZGUucmVtb3ZlKCkpXG4gICAgfVxuICB9LFxuXG4gIHJlcGxhY2VSb290Q29udGFpbmVyKGNvbnRhaW5lciwgdGFnTmFtZSwgYXR0cnMpe1xuICAgIGxldCByZXRhaW5lZEF0dHJzID0gbmV3IFNldChbXCJpZFwiLCBQSFhfU0VTU0lPTiwgUEhYX1NUQVRJQywgUEhYX01BSU4sIFBIWF9ST09UX0lEXSlcbiAgICBpZihjb250YWluZXIudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0YWdOYW1lLnRvTG93ZXJDYXNlKCkpe1xuICAgICAgQXJyYXkuZnJvbShjb250YWluZXIuYXR0cmlidXRlcylcbiAgICAgICAgLmZpbHRlcihhdHRyID0+ICFyZXRhaW5lZEF0dHJzLmhhcyhhdHRyLm5hbWUudG9Mb3dlckNhc2UoKSkpXG4gICAgICAgIC5mb3JFYWNoKGF0dHIgPT4gY29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZShhdHRyLm5hbWUpKVxuXG4gICAgICBPYmplY3Qua2V5cyhhdHRycylcbiAgICAgICAgLmZpbHRlcihuYW1lID0+ICFyZXRhaW5lZEF0dHJzLmhhcyhuYW1lLnRvTG93ZXJDYXNlKCkpKVxuICAgICAgICAuZm9yRWFjaChhdHRyID0+IGNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoYXR0ciwgYXR0cnNbYXR0cl0pKVxuXG4gICAgICByZXR1cm4gY29udGFpbmVyXG5cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5ld0NvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSlcbiAgICAgIE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGF0dHIgPT4gbmV3Q29udGFpbmVyLnNldEF0dHJpYnV0ZShhdHRyLCBhdHRyc1thdHRyXSkpXG4gICAgICByZXRhaW5lZEF0dHJzLmZvckVhY2goYXR0ciA9PiBuZXdDb250YWluZXIuc2V0QXR0cmlidXRlKGF0dHIsIGNvbnRhaW5lci5nZXRBdHRyaWJ1dGUoYXR0cikpKVxuICAgICAgbmV3Q29udGFpbmVyLmlubmVySFRNTCA9IGNvbnRhaW5lci5pbm5lckhUTUxcbiAgICAgIGNvbnRhaW5lci5yZXBsYWNlV2l0aChuZXdDb250YWluZXIpXG4gICAgICByZXR1cm4gbmV3Q29udGFpbmVyXG4gICAgfVxuICB9LFxuXG4gIGdldFN0aWNreShlbCwgbmFtZSwgZGVmYXVsdFZhbCl7XG4gICAgbGV0IG9wID0gKERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKSB8fCBbXSkuZmluZCgoW2V4aXN0aW5nTmFtZSwgXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgIGlmKG9wKXtcbiAgICAgIGxldCBbX25hbWUsIF9vcCwgc3Rhc2hlZFJlc3VsdF0gPSBvcFxuICAgICAgcmV0dXJuIHN0YXNoZWRSZXN1bHRcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHR5cGVvZihkZWZhdWx0VmFsKSA9PT0gXCJmdW5jdGlvblwiID8gZGVmYXVsdFZhbCgpIDogZGVmYXVsdFZhbFxuICAgIH1cbiAgfSxcblxuICBkZWxldGVTdGlja3koZWwsIG5hbWUpe1xuICAgIHRoaXMudXBkYXRlUHJpdmF0ZShlbCwgXCJzdGlja3lcIiwgW10sIG9wcyA9PiB7XG4gICAgICByZXR1cm4gb3BzLmZpbHRlcigoW2V4aXN0aW5nTmFtZSwgX10pID0+IGV4aXN0aW5nTmFtZSAhPT0gbmFtZSlcbiAgICB9KVxuICB9LFxuXG4gIHB1dFN0aWNreShlbCwgbmFtZSwgb3Ape1xuICAgIGxldCBzdGFzaGVkUmVzdWx0ID0gb3AoZWwpXG4gICAgdGhpcy51cGRhdGVQcml2YXRlKGVsLCBcInN0aWNreVwiLCBbXSwgb3BzID0+IHtcbiAgICAgIGxldCBleGlzdGluZ0luZGV4ID0gb3BzLmZpbmRJbmRleCgoW2V4aXN0aW5nTmFtZSwgXSkgPT4gbmFtZSA9PT0gZXhpc3RpbmdOYW1lKVxuICAgICAgaWYoZXhpc3RpbmdJbmRleCA+PSAwKXtcbiAgICAgICAgb3BzW2V4aXN0aW5nSW5kZXhdID0gW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3BzLnB1c2goW25hbWUsIG9wLCBzdGFzaGVkUmVzdWx0XSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHNcbiAgICB9KVxuICB9LFxuXG4gIGFwcGx5U3RpY2t5T3BlcmF0aW9ucyhlbCl7XG4gICAgbGV0IG9wcyA9IERPTS5wcml2YXRlKGVsLCBcInN0aWNreVwiKVxuICAgIGlmKCFvcHMpeyByZXR1cm4gfVxuXG4gICAgb3BzLmZvckVhY2goKFtuYW1lLCBvcCwgX3N0YXNoZWRdKSA9PiB0aGlzLnB1dFN0aWNreShlbCwgbmFtZSwgb3ApKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IERPTVxuIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGU1xufSBmcm9tIFwiLi9jb25zdGFudHNcIlxuXG5pbXBvcnQge1xuICBjaGFubmVsVXBsb2FkZXIsXG4gIGxvZ0Vycm9yXG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXBsb2FkRW50cnkge1xuICBzdGF0aWMgaXNBY3RpdmUoZmlsZUVsLCBmaWxlKXtcbiAgICBsZXQgaXNOZXcgPSBmaWxlLl9waHhSZWYgPT09IHVuZGVmaW5lZFxuICAgIGxldCBhY3RpdmVSZWZzID0gZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfQUNUSVZFX0VOVFJZX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGxldCBpc0FjdGl2ZSA9IGFjdGl2ZVJlZnMuaW5kZXhPZihMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKSkgPj0gMFxuICAgIHJldHVybiBmaWxlLnNpemUgPiAwICYmIChpc05ldyB8fCBpc0FjdGl2ZSlcbiAgfVxuXG4gIHN0YXRpYyBpc1ByZWZsaWdodGVkKGZpbGVFbCwgZmlsZSl7XG4gICAgbGV0IHByZWZsaWdodGVkUmVmcyA9IGZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpLnNwbGl0KFwiLFwiKVxuICAgIGxldCBpc1ByZWZsaWdodGVkID0gcHJlZmxpZ2h0ZWRSZWZzLmluZGV4T2YoTGl2ZVVwbG9hZGVyLmdlbkZpbGVSZWYoZmlsZSkpID49IDBcbiAgICByZXR1cm4gaXNQcmVmbGlnaHRlZCAmJiB0aGlzLmlzQWN0aXZlKGZpbGVFbCwgZmlsZSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGZpbGVFbCwgZmlsZSwgdmlldyl7XG4gICAgdGhpcy5yZWYgPSBMaXZlVXBsb2FkZXIuZ2VuRmlsZVJlZihmaWxlKVxuICAgIHRoaXMuZmlsZUVsID0gZmlsZUVsXG4gICAgdGhpcy5maWxlID0gZmlsZVxuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm1ldGEgPSBudWxsXG4gICAgdGhpcy5faXNDYW5jZWxsZWQgPSBmYWxzZVxuICAgIHRoaXMuX2lzRG9uZSA9IGZhbHNlXG4gICAgdGhpcy5fcHJvZ3Jlc3MgPSAwXG4gICAgdGhpcy5fbGFzdFByb2dyZXNzU2VudCA9IC0xXG4gICAgdGhpcy5fb25Eb25lID0gZnVuY3Rpb24gKCl7IH1cbiAgICB0aGlzLl9vbkVsVXBkYXRlZCA9IHRoaXMub25FbFVwZGF0ZWQuYmluZCh0aGlzKVxuICAgIHRoaXMuZmlsZUVsLmFkZEV2ZW50TGlzdGVuZXIoUEhYX0xJVkVfRklMRV9VUERBVEVELCB0aGlzLl9vbkVsVXBkYXRlZClcbiAgfVxuXG4gIG1ldGFkYXRhKCl7IHJldHVybiB0aGlzLm1ldGEgfVxuXG4gIHByb2dyZXNzKHByb2dyZXNzKXtcbiAgICB0aGlzLl9wcm9ncmVzcyA9IE1hdGguZmxvb3IocHJvZ3Jlc3MpXG4gICAgaWYodGhpcy5fcHJvZ3Jlc3MgPiB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50KXtcbiAgICAgIGlmKHRoaXMuX3Byb2dyZXNzID49IDEwMCl7XG4gICAgICAgIHRoaXMuX3Byb2dyZXNzID0gMTAwXG4gICAgICAgIHRoaXMuX2xhc3RQcm9ncmVzc1NlbnQgPSAxMDBcbiAgICAgICAgdGhpcy5faXNEb25lID0gdHJ1ZVxuICAgICAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIDEwMCwgKCkgPT4ge1xuICAgICAgICAgIExpdmVVcGxvYWRlci51bnRyYWNrRmlsZSh0aGlzLmZpbGVFbCwgdGhpcy5maWxlKVxuICAgICAgICAgIHRoaXMuX29uRG9uZSgpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9sYXN0UHJvZ3Jlc3NTZW50ID0gdGhpcy5fcHJvZ3Jlc3NcbiAgICAgICAgdGhpcy52aWV3LnB1c2hGaWxlUHJvZ3Jlc3ModGhpcy5maWxlRWwsIHRoaXMucmVmLCB0aGlzLl9wcm9ncmVzcylcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjYW5jZWwoKXtcbiAgICB0aGlzLl9pc0NhbmNlbGxlZCA9IHRydWVcbiAgICB0aGlzLl9pc0RvbmUgPSB0cnVlXG4gICAgdGhpcy5fb25Eb25lKClcbiAgfVxuXG4gIGlzRG9uZSgpeyByZXR1cm4gdGhpcy5faXNEb25lIH1cblxuICBlcnJvcihyZWFzb24gPSBcImZhaWxlZFwiKXtcbiAgICB0aGlzLnZpZXcucHVzaEZpbGVQcm9ncmVzcyh0aGlzLmZpbGVFbCwgdGhpcy5yZWYsIHtlcnJvcjogcmVhc29ufSlcbiAgICBMaXZlVXBsb2FkZXIuY2xlYXJGaWxlcyh0aGlzLmZpbGVFbClcbiAgfVxuXG4gIC8vcHJpdmF0ZVxuXG4gIG9uRG9uZShjYWxsYmFjayl7XG4gICAgdGhpcy5fb25Eb25lID0gKCkgPT4ge1xuICAgICAgdGhpcy5maWxlRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihQSFhfTElWRV9GSUxFX1VQREFURUQsIHRoaXMuX29uRWxVcGRhdGVkKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIG9uRWxVcGRhdGVkKCl7XG4gICAgbGV0IGFjdGl2ZVJlZnMgPSB0aGlzLmZpbGVFbC5nZXRBdHRyaWJ1dGUoUEhYX0FDVElWRV9FTlRSWV9SRUZTKS5zcGxpdChcIixcIilcbiAgICBpZihhY3RpdmVSZWZzLmluZGV4T2YodGhpcy5yZWYpID09PSAtMSl7IHRoaXMuY2FuY2VsKCkgfVxuICB9XG5cbiAgdG9QcmVmbGlnaHRQYXlsb2FkKCl7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxhc3RfbW9kaWZpZWQ6IHRoaXMuZmlsZS5sYXN0TW9kaWZpZWQsXG4gICAgICBuYW1lOiB0aGlzLmZpbGUubmFtZSxcbiAgICAgIHNpemU6IHRoaXMuZmlsZS5zaXplLFxuICAgICAgdHlwZTogdGhpcy5maWxlLnR5cGUsXG4gICAgICByZWY6IHRoaXMucmVmXG4gICAgfVxuICB9XG5cbiAgdXBsb2FkZXIodXBsb2FkZXJzKXtcbiAgICBpZih0aGlzLm1ldGEudXBsb2FkZXIpe1xuICAgICAgbGV0IGNhbGxiYWNrID0gdXBsb2FkZXJzW3RoaXMubWV0YS51cGxvYWRlcl0gfHwgbG9nRXJyb3IoYG5vIHVwbG9hZGVyIGNvbmZpZ3VyZWQgZm9yICR7dGhpcy5tZXRhLnVwbG9hZGVyfWApXG4gICAgICByZXR1cm4ge25hbWU6IHRoaXMubWV0YS51cGxvYWRlciwgY2FsbGJhY2s6IGNhbGxiYWNrfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge25hbWU6IFwiY2hhbm5lbFwiLCBjYWxsYmFjazogY2hhbm5lbFVwbG9hZGVyfVxuICAgIH1cbiAgfVxuXG4gIHppcFBvc3RGbGlnaHQocmVzcCl7XG4gICAgdGhpcy5tZXRhID0gcmVzcC5lbnRyaWVzW3RoaXMucmVmXVxuICAgIGlmKCF0aGlzLm1ldGEpeyBsb2dFcnJvcihgbm8gcHJlZmxpZ2h0IHVwbG9hZCByZXNwb25zZSByZXR1cm5lZCB3aXRoIHJlZiAke3RoaXMucmVmfWAsIHtpbnB1dDogdGhpcy5maWxlRWwsIHJlc3BvbnNlOiByZXNwfSkgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgUEhYX0RPTkVfUkVGUyxcbiAgUEhYX1BSRUZMSUdIVEVEX1JFRlMsXG4gIFBIWF9VUExPQURfUkVGXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG59IGZyb20gXCIuL3V0aWxzXCJcblxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IFVwbG9hZEVudHJ5IGZyb20gXCIuL3VwbG9hZF9lbnRyeVwiXG5cbmxldCBsaXZlVXBsb2FkZXJGaWxlUmVmID0gMFxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaXZlVXBsb2FkZXIge1xuICBzdGF0aWMgZ2VuRmlsZVJlZihmaWxlKXtcbiAgICBsZXQgcmVmID0gZmlsZS5fcGh4UmVmXG4gICAgaWYocmVmICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuIHJlZlxuICAgIH0gZWxzZSB7XG4gICAgICBmaWxlLl9waHhSZWYgPSAobGl2ZVVwbG9hZGVyRmlsZVJlZisrKS50b1N0cmluZygpXG4gICAgICByZXR1cm4gZmlsZS5fcGh4UmVmXG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGdldEVudHJ5RGF0YVVSTChpbnB1dEVsLCByZWYsIGNhbGxiYWNrKXtcbiAgICBsZXQgZmlsZSA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbCkuZmluZChmaWxlID0+IHRoaXMuZ2VuRmlsZVJlZihmaWxlKSA9PT0gcmVmKVxuICAgIGNhbGxiYWNrKFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSkpXG4gIH1cblxuICBzdGF0aWMgaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKXtcbiAgICBsZXQgYWN0aXZlID0gMFxuICAgIERPTS5maW5kVXBsb2FkSW5wdXRzKGZvcm1FbCkuZm9yRWFjaChpbnB1dCA9PiB7XG4gICAgICBpZihpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpICE9PSBpbnB1dC5nZXRBdHRyaWJ1dGUoUEhYX0RPTkVfUkVGUykpe1xuICAgICAgICBhY3RpdmUrK1xuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGFjdGl2ZSA+IDBcbiAgfVxuXG4gIHN0YXRpYyBzZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpe1xuICAgIGxldCBmaWxlcyA9IHRoaXMuYWN0aXZlRmlsZXMoaW5wdXRFbClcbiAgICBsZXQgZmlsZURhdGEgPSB7fVxuICAgIGZpbGVzLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBsZXQgZW50cnkgPSB7cGF0aDogaW5wdXRFbC5uYW1lfVxuICAgICAgbGV0IHVwbG9hZFJlZiA9IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKVxuICAgICAgZmlsZURhdGFbdXBsb2FkUmVmXSA9IGZpbGVEYXRhW3VwbG9hZFJlZl0gfHwgW11cbiAgICAgIGVudHJ5LnJlZiA9IHRoaXMuZ2VuRmlsZVJlZihmaWxlKVxuICAgICAgZW50cnkubmFtZSA9IGZpbGUubmFtZSB8fCBlbnRyeS5yZWZcbiAgICAgIGVudHJ5LnR5cGUgPSBmaWxlLnR5cGVcbiAgICAgIGVudHJ5LnNpemUgPSBmaWxlLnNpemVcbiAgICAgIGZpbGVEYXRhW3VwbG9hZFJlZl0ucHVzaChlbnRyeSlcbiAgICB9KVxuICAgIHJldHVybiBmaWxlRGF0YVxuICB9XG5cbiAgc3RhdGljIGNsZWFyRmlsZXMoaW5wdXRFbCl7XG4gICAgaW5wdXRFbC52YWx1ZSA9IG51bGxcbiAgICBpbnB1dEVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRilcbiAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIFtdKVxuICB9XG5cbiAgc3RhdGljIHVudHJhY2tGaWxlKGlucHV0RWwsIGZpbGUpe1xuICAgIERPTS5wdXRQcml2YXRlKGlucHV0RWwsIFwiZmlsZXNcIiwgRE9NLnByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiKS5maWx0ZXIoZiA9PiAhT2JqZWN0LmlzKGYsIGZpbGUpKSlcbiAgfVxuXG4gIHN0YXRpYyB0cmFja0ZpbGVzKGlucHV0RWwsIGZpbGVzKXtcbiAgICBpZihpbnB1dEVsLmdldEF0dHJpYnV0ZShcIm11bHRpcGxlXCIpICE9PSBudWxsKXtcbiAgICAgIGxldCBuZXdGaWxlcyA9IGZpbGVzLmZpbHRlcihmaWxlID0+ICF0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpLmZpbmQoZiA9PiBPYmplY3QuaXMoZiwgZmlsZSkpKVxuICAgICAgRE9NLnB1dFByaXZhdGUoaW5wdXRFbCwgXCJmaWxlc1wiLCB0aGlzLmFjdGl2ZUZpbGVzKGlucHV0RWwpLmNvbmNhdChuZXdGaWxlcykpXG4gICAgICBpbnB1dEVsLnZhbHVlID0gbnVsbFxuICAgIH0gZWxzZSB7XG4gICAgICBET00ucHV0UHJpdmF0ZShpbnB1dEVsLCBcImZpbGVzXCIsIGZpbGVzKVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBhY3RpdmVGaWxlSW5wdXRzKGZvcm1FbCl7XG4gICAgbGV0IGZpbGVJbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyhmb3JtRWwpXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZmlsZUlucHV0cykuZmlsdGVyKGVsID0+IGVsLmZpbGVzICYmIHRoaXMuYWN0aXZlRmlsZXMoZWwpLmxlbmd0aCA+IDApXG4gIH1cblxuICBzdGF0aWMgYWN0aXZlRmlsZXMoaW5wdXQpe1xuICAgIHJldHVybiAoRE9NLnByaXZhdGUoaW5wdXQsIFwiZmlsZXNcIikgfHwgW10pLmZpbHRlcihmID0+IFVwbG9hZEVudHJ5LmlzQWN0aXZlKGlucHV0LCBmKSlcbiAgfVxuXG4gIHN0YXRpYyBpbnB1dHNBd2FpdGluZ1ByZWZsaWdodChmb3JtRWwpe1xuICAgIGxldCBmaWxlSW5wdXRzID0gRE9NLmZpbmRVcGxvYWRJbnB1dHMoZm9ybUVsKVxuICAgIHJldHVybiBBcnJheS5mcm9tKGZpbGVJbnB1dHMpLmZpbHRlcihpbnB1dCA9PiB0aGlzLmZpbGVzQXdhaXRpbmdQcmVmbGlnaHQoaW5wdXQpLmxlbmd0aCA+IDApXG4gIH1cblxuICBzdGF0aWMgZmlsZXNBd2FpdGluZ1ByZWZsaWdodChpbnB1dCl7XG4gICAgcmV0dXJuIHRoaXMuYWN0aXZlRmlsZXMoaW5wdXQpLmZpbHRlcihmID0+ICFVcGxvYWRFbnRyeS5pc1ByZWZsaWdodGVkKGlucHV0LCBmKSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKGlucHV0RWwsIHZpZXcsIG9uQ29tcGxldGUpe1xuICAgIHRoaXMudmlldyA9IHZpZXdcbiAgICB0aGlzLm9uQ29tcGxldGUgPSBvbkNvbXBsZXRlXG4gICAgdGhpcy5fZW50cmllcyA9XG4gICAgICBBcnJheS5mcm9tKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpIHx8IFtdKVxuICAgICAgICAubWFwKGZpbGUgPT4gbmV3IFVwbG9hZEVudHJ5KGlucHV0RWwsIGZpbGUsIHZpZXcpKVxuXG4gICAgdGhpcy5udW1FbnRyaWVzSW5Qcm9ncmVzcyA9IHRoaXMuX2VudHJpZXMubGVuZ3RoXG4gIH1cblxuICBlbnRyaWVzKCl7IHJldHVybiB0aGlzLl9lbnRyaWVzIH1cblxuICBpbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCBsaXZlU29ja2V0KXtcbiAgICB0aGlzLl9lbnRyaWVzID1cbiAgICAgIHRoaXMuX2VudHJpZXMubWFwKGVudHJ5ID0+IHtcbiAgICAgICAgZW50cnkuemlwUG9zdEZsaWdodChyZXNwKVxuICAgICAgICBlbnRyeS5vbkRvbmUoKCkgPT4ge1xuICAgICAgICAgIHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MtLVxuICAgICAgICAgIGlmKHRoaXMubnVtRW50cmllc0luUHJvZ3Jlc3MgPT09IDApeyB0aGlzLm9uQ29tcGxldGUoKSB9XG4gICAgICAgIH0pXG4gICAgICAgIHJldHVybiBlbnRyeVxuICAgICAgfSlcblxuICAgIGxldCBncm91cGVkRW50cmllcyA9IHRoaXMuX2VudHJpZXMucmVkdWNlKChhY2MsIGVudHJ5KSA9PiB7XG4gICAgICBsZXQge25hbWUsIGNhbGxiYWNrfSA9IGVudHJ5LnVwbG9hZGVyKGxpdmVTb2NrZXQudXBsb2FkZXJzKVxuICAgICAgYWNjW25hbWVdID0gYWNjW25hbWVdIHx8IHtjYWxsYmFjazogY2FsbGJhY2ssIGVudHJpZXM6IFtdfVxuICAgICAgYWNjW25hbWVdLmVudHJpZXMucHVzaChlbnRyeSlcbiAgICAgIHJldHVybiBhY2NcbiAgICB9LCB7fSlcblxuICAgIGZvcihsZXQgbmFtZSBpbiBncm91cGVkRW50cmllcyl7XG4gICAgICBsZXQge2NhbGxiYWNrLCBlbnRyaWVzfSA9IGdyb3VwZWRFbnRyaWVzW25hbWVdXG4gICAgICBjYWxsYmFjayhlbnRyaWVzLCBvbkVycm9yLCByZXNwLCBsaXZlU29ja2V0KVxuICAgIH1cbiAgfVxufVxuIiwgImltcG9ydCB7XG4gIFBIWF9BQ1RJVkVfRU5UUllfUkVGUyxcbiAgUEhYX0xJVkVfRklMRV9VUERBVEVELFxuICBQSFhfUFJFRkxJR0hURURfUkVGUyxcbiAgUEhYX1VQTE9BRF9SRUZcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IExpdmVVcGxvYWRlciBmcm9tIFwiLi9saXZlX3VwbG9hZGVyXCJcblxubGV0IEhvb2tzID0ge1xuICBMaXZlRmlsZVVwbG9hZDoge1xuICAgIGFjdGl2ZVJlZnMoKXsgcmV0dXJuIHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9BQ1RJVkVfRU5UUllfUkVGUykgfSxcblxuICAgIHByZWZsaWdodGVkUmVmcygpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1BSRUZMSUdIVEVEX1JFRlMpIH0sXG5cbiAgICBtb3VudGVkKCl7IHRoaXMucHJlZmxpZ2h0ZWRXYXMgPSB0aGlzLnByZWZsaWdodGVkUmVmcygpIH0sXG5cbiAgICB1cGRhdGVkKCl7XG4gICAgICBsZXQgbmV3UHJlZmxpZ2h0cyA9IHRoaXMucHJlZmxpZ2h0ZWRSZWZzKClcbiAgICAgIGlmKHRoaXMucHJlZmxpZ2h0ZWRXYXMgIT09IG5ld1ByZWZsaWdodHMpe1xuICAgICAgICB0aGlzLnByZWZsaWdodGVkV2FzID0gbmV3UHJlZmxpZ2h0c1xuICAgICAgICBpZihuZXdQcmVmbGlnaHRzID09PSBcIlwiKXtcbiAgICAgICAgICB0aGlzLl9fdmlldy5jYW5jZWxTdWJtaXQodGhpcy5lbC5mb3JtKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmKHRoaXMuYWN0aXZlUmVmcygpID09PSBcIlwiKXsgdGhpcy5lbC52YWx1ZSA9IG51bGwgfVxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChQSFhfTElWRV9GSUxFX1VQREFURUQpKVxuICAgIH1cbiAgfSxcblxuICBMaXZlSW1nUHJldmlldzoge1xuICAgIG1vdW50ZWQoKXtcbiAgICAgIHRoaXMucmVmID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1lbnRyeS1yZWZcIilcbiAgICAgIHRoaXMuaW5wdXRFbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuZWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSlcbiAgICAgIExpdmVVcGxvYWRlci5nZXRFbnRyeURhdGFVUkwodGhpcy5pbnB1dEVsLCB0aGlzLnJlZiwgdXJsID0+IHtcbiAgICAgICAgdGhpcy51cmwgPSB1cmxcbiAgICAgICAgdGhpcy5lbC5zcmMgPSB1cmxcbiAgICAgIH0pXG4gICAgfSxcbiAgICBkZXN0cm95ZWQoKXtcbiAgICAgIFVSTC5yZXZva2VPYmplY3RVUkwodGhpcy51cmwpXG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhvb2tzXG4iLCAiaW1wb3J0IHtcbiAgbWF5YmVcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBvc3RNb3JwaFJlc3RvcmVyIHtcbiAgY29uc3RydWN0b3IoY29udGFpbmVyQmVmb3JlLCBjb250YWluZXJBZnRlciwgdXBkYXRlVHlwZSl7XG4gICAgbGV0IGlkc0JlZm9yZSA9IG5ldyBTZXQoKVxuICAgIGxldCBpZHNBZnRlciA9IG5ldyBTZXQoWy4uLmNvbnRhaW5lckFmdGVyLmNoaWxkcmVuXS5tYXAoY2hpbGQgPT4gY2hpbGQuaWQpKVxuXG4gICAgbGV0IGVsZW1lbnRzVG9Nb2RpZnkgPSBbXVxuXG4gICAgQXJyYXkuZnJvbShjb250YWluZXJCZWZvcmUuY2hpbGRyZW4pLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgaWYoY2hpbGQuaWQpeyAvLyBhbGwgb2Ygb3VyIGNoaWxkcmVuIHNob3VsZCBiZSBlbGVtZW50cyB3aXRoIGlkc1xuICAgICAgICBpZHNCZWZvcmUuYWRkKGNoaWxkLmlkKVxuICAgICAgICBpZihpZHNBZnRlci5oYXMoY2hpbGQuaWQpKXtcbiAgICAgICAgICBsZXQgcHJldmlvdXNFbGVtZW50SWQgPSBjaGlsZC5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGNoaWxkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcuaWRcbiAgICAgICAgICBlbGVtZW50c1RvTW9kaWZ5LnB1c2goe2VsZW1lbnRJZDogY2hpbGQuaWQsIHByZXZpb3VzRWxlbWVudElkOiBwcmV2aW91c0VsZW1lbnRJZH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgdGhpcy5jb250YWluZXJJZCA9IGNvbnRhaW5lckFmdGVyLmlkXG4gICAgdGhpcy51cGRhdGVUeXBlID0gdXBkYXRlVHlwZVxuICAgIHRoaXMuZWxlbWVudHNUb01vZGlmeSA9IGVsZW1lbnRzVG9Nb2RpZnlcbiAgICB0aGlzLmVsZW1lbnRJZHNUb0FkZCA9IFsuLi5pZHNBZnRlcl0uZmlsdGVyKGlkID0+ICFpZHNCZWZvcmUuaGFzKGlkKSlcbiAgfVxuXG4gIC8vIFdlIGRvIHRoZSBmb2xsb3dpbmcgdG8gb3B0aW1pemUgYXBwZW5kL3ByZXBlbmQgb3BlcmF0aW9uczpcbiAgLy8gICAxKSBUcmFjayBpZHMgb2YgbW9kaWZpZWQgZWxlbWVudHMgJiBvZiBuZXcgZWxlbWVudHNcbiAgLy8gICAyKSBBbGwgdGhlIG1vZGlmaWVkIGVsZW1lbnRzIGFyZSBwdXQgYmFjayBpbiB0aGUgY29ycmVjdCBwb3NpdGlvbiBpbiB0aGUgRE9NIHRyZWVcbiAgLy8gICAgICBieSBzdG9yaW5nIHRoZSBpZCBvZiB0aGVpciBwcmV2aW91cyBzaWJsaW5nXG4gIC8vICAgMykgTmV3IGVsZW1lbnRzIGFyZSBnb2luZyB0byBiZSBwdXQgaW4gdGhlIHJpZ2h0IHBsYWNlIGJ5IG1vcnBoZG9tIGR1cmluZyBhcHBlbmQuXG4gIC8vICAgICAgRm9yIHByZXBlbmQsIHdlIG1vdmUgdGhlbSB0byB0aGUgZmlyc3QgcG9zaXRpb24gaW4gdGhlIGNvbnRhaW5lclxuICBwZXJmb3JtKCl7XG4gICAgbGV0IGNvbnRhaW5lciA9IERPTS5ieUlkKHRoaXMuY29udGFpbmVySWQpXG4gICAgdGhpcy5lbGVtZW50c1RvTW9kaWZ5LmZvckVhY2goZWxlbWVudFRvTW9kaWZ5ID0+IHtcbiAgICAgIGlmKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCl7XG4gICAgICAgIG1heWJlKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRUb01vZGlmeS5wcmV2aW91c0VsZW1lbnRJZCksIHByZXZpb3VzRWxlbSA9PiB7XG4gICAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgICAgbGV0IGlzSW5SaWdodFBsYWNlID0gZWxlbS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nICYmIGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZy5pZCA9PSBwcmV2aW91c0VsZW0uaWRcbiAgICAgICAgICAgIGlmKCFpc0luUmlnaHRQbGFjZSl7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWxlbS5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmVuZFwiLCBlbGVtKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUaGlzIGlzIHRoZSBmaXJzdCBlbGVtZW50IGluIHRoZSBjb250YWluZXJcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudFRvTW9kaWZ5LmVsZW1lbnRJZCksIGVsZW0gPT4ge1xuICAgICAgICAgIGxldCBpc0luUmlnaHRQbGFjZSA9IGVsZW0ucHJldmlvdXNFbGVtZW50U2libGluZyA9PSBudWxsXG4gICAgICAgICAgaWYoIWlzSW5SaWdodFBsYWNlKXtcbiAgICAgICAgICAgIGNvbnRhaW5lci5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGVsZW0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZih0aGlzLnVwZGF0ZVR5cGUgPT0gXCJwcmVwZW5kXCIpe1xuICAgICAgdGhpcy5lbGVtZW50SWRzVG9BZGQucmV2ZXJzZSgpLmZvckVhY2goZWxlbUlkID0+IHtcbiAgICAgICAgbWF5YmUoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbUlkKSwgZWxlbSA9PiBjb250YWluZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KFwiYWZ0ZXJiZWdpblwiLCBlbGVtKSlcbiAgICAgIH0pXG4gICAgfVxuICB9XG59XG4iLCAidmFyIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSAxMTtcblxuZnVuY3Rpb24gbW9ycGhBdHRycyhmcm9tTm9kZSwgdG9Ob2RlKSB7XG4gICAgdmFyIHRvTm9kZUF0dHJzID0gdG9Ob2RlLmF0dHJpYnV0ZXM7XG4gICAgdmFyIGF0dHI7XG4gICAgdmFyIGF0dHJOYW1lO1xuICAgIHZhciBhdHRyTmFtZXNwYWNlVVJJO1xuICAgIHZhciBhdHRyVmFsdWU7XG4gICAgdmFyIGZyb21WYWx1ZTtcblxuICAgIC8vIGRvY3VtZW50LWZyYWdtZW50cyBkb250IGhhdmUgYXR0cmlidXRlcyBzbyBsZXRzIG5vdCBkbyBhbnl0aGluZ1xuICAgIGlmICh0b05vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgfHwgZnJvbU5vZGUubm9kZVR5cGUgPT09IERPQ1VNRU5UX0ZSQUdNRU5UX05PREUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgYXR0cmlidXRlcyBvbiBvcmlnaW5hbCBET00gZWxlbWVudFxuICAgIGZvciAodmFyIGkgPSB0b05vZGVBdHRycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhdHRyID0gdG9Ob2RlQXR0cnNbaV07XG4gICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lO1xuICAgICAgICBhdHRyTmFtZXNwYWNlVVJJID0gYXR0ci5uYW1lc3BhY2VVUkk7XG4gICAgICAgIGF0dHJWYWx1ZSA9IGF0dHIudmFsdWU7XG5cbiAgICAgICAgaWYgKGF0dHJOYW1lc3BhY2VVUkkpIHtcbiAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5sb2NhbE5hbWUgfHwgYXR0ck5hbWU7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGVOUyhhdHRyTmFtZXNwYWNlVVJJLCBhdHRyTmFtZSk7XG5cbiAgICAgICAgICAgIGlmIChmcm9tVmFsdWUgIT09IGF0dHJWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChhdHRyLnByZWZpeCA9PT0gJ3htbG5zJyl7XG4gICAgICAgICAgICAgICAgICAgIGF0dHJOYW1lID0gYXR0ci5uYW1lOyAvLyBJdCdzIG5vdCBhbGxvd2VkIHRvIHNldCBhbiBhdHRyaWJ1dGUgd2l0aCB0aGUgWE1MTlMgbmFtZXNwYWNlIHdpdGhvdXQgc3BlY2lmeWluZyB0aGUgYHhtbG5zYCBwcmVmaXhcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUuc2V0QXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tVmFsdWUgPSBmcm9tTm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuXG4gICAgICAgICAgICBpZiAoZnJvbVZhbHVlICE9PSBhdHRyVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmcm9tTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ck5hbWUsIGF0dHJWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZW1vdmUgYW55IGV4dHJhIGF0dHJpYnV0ZXMgZm91bmQgb24gdGhlIG9yaWdpbmFsIERPTSBlbGVtZW50IHRoYXRcbiAgICAvLyB3ZXJlbid0IGZvdW5kIG9uIHRoZSB0YXJnZXQgZWxlbWVudC5cbiAgICB2YXIgZnJvbU5vZGVBdHRycyA9IGZyb21Ob2RlLmF0dHJpYnV0ZXM7XG5cbiAgICBmb3IgKHZhciBkID0gZnJvbU5vZGVBdHRycy5sZW5ndGggLSAxOyBkID49IDA7IGQtLSkge1xuICAgICAgICBhdHRyID0gZnJvbU5vZGVBdHRyc1tkXTtcbiAgICAgICAgYXR0ck5hbWUgPSBhdHRyLm5hbWU7XG4gICAgICAgIGF0dHJOYW1lc3BhY2VVUkkgPSBhdHRyLm5hbWVzcGFjZVVSSTtcblxuICAgICAgICBpZiAoYXR0ck5hbWVzcGFjZVVSSSkge1xuICAgICAgICAgICAgYXR0ck5hbWUgPSBhdHRyLmxvY2FsTmFtZSB8fCBhdHRyTmFtZTtcblxuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpKSB7XG4gICAgICAgICAgICAgICAgZnJvbU5vZGUucmVtb3ZlQXR0cmlidXRlTlMoYXR0ck5hbWVzcGFjZVVSSSwgYXR0ck5hbWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCF0b05vZGUuaGFzQXR0cmlidXRlKGF0dHJOYW1lKSkge1xuICAgICAgICAgICAgICAgIGZyb21Ob2RlLnJlbW92ZUF0dHJpYnV0ZShhdHRyTmFtZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbnZhciByYW5nZTsgLy8gQ3JlYXRlIGEgcmFuZ2Ugb2JqZWN0IGZvciBlZmZpY2VudGx5IHJlbmRlcmluZyBzdHJpbmdzIHRvIGVsZW1lbnRzLlxudmFyIE5TX1hIVE1MID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGh0bWwnO1xuXG52YXIgZG9jID0gdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZCA6IGRvY3VtZW50O1xudmFyIEhBU19URU1QTEFURV9TVVBQT1JUID0gISFkb2MgJiYgJ2NvbnRlbnQnIGluIGRvYy5jcmVhdGVFbGVtZW50KCd0ZW1wbGF0ZScpO1xudmFyIEhBU19SQU5HRV9TVVBQT1JUID0gISFkb2MgJiYgZG9jLmNyZWF0ZVJhbmdlICYmICdjcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQnIGluIGRvYy5jcmVhdGVSYW5nZSgpO1xuXG5mdW5jdGlvbiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpIHtcbiAgICB2YXIgdGVtcGxhdGUgPSBkb2MuY3JlYXRlRWxlbWVudCgndGVtcGxhdGUnKTtcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBzdHI7XG4gICAgcmV0dXJuIHRlbXBsYXRlLmNvbnRlbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tUmFuZ2Uoc3RyKSB7XG4gICAgaWYgKCFyYW5nZSkge1xuICAgICAgICByYW5nZSA9IGRvYy5jcmVhdGVSYW5nZSgpO1xuICAgICAgICByYW5nZS5zZWxlY3ROb2RlKGRvYy5ib2R5KTtcbiAgICB9XG5cbiAgICB2YXIgZnJhZ21lbnQgPSByYW5nZS5jcmVhdGVDb250ZXh0dWFsRnJhZ21lbnQoc3RyKTtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlRnJhZ21lbnRGcm9tV3JhcChzdHIpIHtcbiAgICB2YXIgZnJhZ21lbnQgPSBkb2MuY3JlYXRlRWxlbWVudCgnYm9keScpO1xuICAgIGZyYWdtZW50LmlubmVySFRNTCA9IHN0cjtcbiAgICByZXR1cm4gZnJhZ21lbnQuY2hpbGROb2Rlc1swXTtcbn1cblxuLyoqXG4gKiBUaGlzIGlzIGFib3V0IHRoZSBzYW1lXG4gKiB2YXIgaHRtbCA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoc3RyLCAndGV4dC9odG1sJyk7XG4gKiByZXR1cm4gaHRtbC5ib2R5LmZpcnN0Q2hpbGQ7XG4gKlxuICogQG1ldGhvZCB0b0VsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzdHJcbiAqL1xuZnVuY3Rpb24gdG9FbGVtZW50KHN0cikge1xuICAgIHN0ciA9IHN0ci50cmltKCk7XG4gICAgaWYgKEhBU19URU1QTEFURV9TVVBQT1JUKSB7XG4gICAgICAvLyBhdm9pZCByZXN0cmljdGlvbnMgb24gY29udGVudCBmb3IgdGhpbmdzIGxpa2UgYDx0cj48dGg+SGk8L3RoPjwvdHI+YCB3aGljaFxuICAgICAgLy8gY3JlYXRlQ29udGV4dHVhbEZyYWdtZW50IGRvZXNuJ3Qgc3VwcG9ydFxuICAgICAgLy8gPHRlbXBsYXRlPiBzdXBwb3J0IG5vdCBhdmFpbGFibGUgaW4gSUVcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21UZW1wbGF0ZShzdHIpO1xuICAgIH0gZWxzZSBpZiAoSEFTX1JBTkdFX1NVUFBPUlQpIHtcbiAgICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21SYW5nZShzdHIpO1xuICAgIH1cblxuICAgIHJldHVybiBjcmVhdGVGcmFnbWVudEZyb21XcmFwKHN0cik7XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHR3byBub2RlJ3MgbmFtZXMgYXJlIHRoZSBzYW1lLlxuICpcbiAqIE5PVEU6IFdlIGRvbid0IGJvdGhlciBjaGVja2luZyBgbmFtZXNwYWNlVVJJYCBiZWNhdXNlIHlvdSB3aWxsIG5ldmVyIGZpbmQgdHdvIEhUTUwgZWxlbWVudHMgd2l0aCB0aGUgc2FtZVxuICogICAgICAgbm9kZU5hbWUgYW5kIGRpZmZlcmVudCBuYW1lc3BhY2UgVVJJcy5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGFcbiAqIEBwYXJhbSB7RWxlbWVudH0gYiBUaGUgdGFyZ2V0IGVsZW1lbnRcbiAqIEByZXR1cm4ge2Jvb2xlYW59XG4gKi9cbmZ1bmN0aW9uIGNvbXBhcmVOb2RlTmFtZXMoZnJvbUVsLCB0b0VsKSB7XG4gICAgdmFyIGZyb21Ob2RlTmFtZSA9IGZyb21FbC5ub2RlTmFtZTtcbiAgICB2YXIgdG9Ob2RlTmFtZSA9IHRvRWwubm9kZU5hbWU7XG4gICAgdmFyIGZyb21Db2RlU3RhcnQsIHRvQ29kZVN0YXJ0O1xuXG4gICAgaWYgKGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBmcm9tQ29kZVN0YXJ0ID0gZnJvbU5vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG4gICAgdG9Db2RlU3RhcnQgPSB0b05vZGVOYW1lLmNoYXJDb2RlQXQoMCk7XG5cbiAgICAvLyBJZiB0aGUgdGFyZ2V0IGVsZW1lbnQgaXMgYSB2aXJ0dWFsIERPTSBub2RlIG9yIFNWRyBub2RlIHRoZW4gd2UgbWF5XG4gICAgLy8gbmVlZCB0byBub3JtYWxpemUgdGhlIHRhZyBuYW1lIGJlZm9yZSBjb21wYXJpbmcuIE5vcm1hbCBIVE1MIGVsZW1lbnRzIHRoYXQgYXJlXG4gICAgLy8gaW4gdGhlIFwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94aHRtbFwiXG4gICAgLy8gYXJlIGNvbnZlcnRlZCB0byB1cHBlciBjYXNlXG4gICAgaWYgKGZyb21Db2RlU3RhcnQgPD0gOTAgJiYgdG9Db2RlU3RhcnQgPj0gOTcpIHsgLy8gZnJvbSBpcyB1cHBlciBhbmQgdG8gaXMgbG93ZXJcbiAgICAgICAgcmV0dXJuIGZyb21Ob2RlTmFtZSA9PT0gdG9Ob2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH0gZWxzZSBpZiAodG9Db2RlU3RhcnQgPD0gOTAgJiYgZnJvbUNvZGVTdGFydCA+PSA5NykgeyAvLyB0byBpcyB1cHBlciBhbmQgZnJvbSBpcyBsb3dlclxuICAgICAgICByZXR1cm4gdG9Ob2RlTmFtZSA9PT0gZnJvbU5vZGVOYW1lLnRvVXBwZXJDYXNlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn1cblxuLyoqXG4gKiBDcmVhdGUgYW4gZWxlbWVudCwgb3B0aW9uYWxseSB3aXRoIGEga25vd24gbmFtZXNwYWNlIFVSSS5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZSB0aGUgZWxlbWVudCBuYW1lLCBlLmcuICdkaXYnIG9yICdzdmcnXG4gKiBAcGFyYW0ge3N0cmluZ30gW25hbWVzcGFjZVVSSV0gdGhlIGVsZW1lbnQncyBuYW1lc3BhY2UgVVJJLCBpLmUuIHRoZSB2YWx1ZSBvZlxuICogaXRzIGB4bWxuc2AgYXR0cmlidXRlIG9yIGl0cyBpbmZlcnJlZCBuYW1lc3BhY2UuXG4gKlxuICogQHJldHVybiB7RWxlbWVudH1cbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudE5TKG5hbWUsIG5hbWVzcGFjZVVSSSkge1xuICAgIHJldHVybiAhbmFtZXNwYWNlVVJJIHx8IG5hbWVzcGFjZVVSSSA9PT0gTlNfWEhUTUwgP1xuICAgICAgICBkb2MuY3JlYXRlRWxlbWVudChuYW1lKSA6XG4gICAgICAgIGRvYy5jcmVhdGVFbGVtZW50TlMobmFtZXNwYWNlVVJJLCBuYW1lKTtcbn1cblxuLyoqXG4gKiBDb3BpZXMgdGhlIGNoaWxkcmVuIG9mIG9uZSBET00gZWxlbWVudCB0byBhbm90aGVyIERPTSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIG1vdmVDaGlsZHJlbihmcm9tRWwsIHRvRWwpIHtcbiAgICB2YXIgY3VyQ2hpbGQgPSBmcm9tRWwuZmlyc3RDaGlsZDtcbiAgICB3aGlsZSAoY3VyQ2hpbGQpIHtcbiAgICAgICAgdmFyIG5leHRDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICB0b0VsLmFwcGVuZENoaWxkKGN1ckNoaWxkKTtcbiAgICAgICAgY3VyQ2hpbGQgPSBuZXh0Q2hpbGQ7XG4gICAgfVxuICAgIHJldHVybiB0b0VsO1xufVxuXG5mdW5jdGlvbiBzeW5jQm9vbGVhbkF0dHJQcm9wKGZyb21FbCwgdG9FbCwgbmFtZSkge1xuICAgIGlmIChmcm9tRWxbbmFtZV0gIT09IHRvRWxbbmFtZV0pIHtcbiAgICAgICAgZnJvbUVsW25hbWVdID0gdG9FbFtuYW1lXTtcbiAgICAgICAgaWYgKGZyb21FbFtuYW1lXSkge1xuICAgICAgICAgICAgZnJvbUVsLnNldEF0dHJpYnV0ZShuYW1lLCAnJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG52YXIgc3BlY2lhbEVsSGFuZGxlcnMgPSB7XG4gICAgT1BUSU9OOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgdmFyIHBhcmVudE5vZGUgPSBmcm9tRWwucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHBhcmVudE5vZGUpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnROYW1lID0gcGFyZW50Tm9kZS5ub2RlTmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlID0gcGFyZW50Tm9kZS5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIHBhcmVudE5hbWUgPSBwYXJlbnROb2RlICYmIHBhcmVudE5vZGUubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJlbnROYW1lID09PSAnU0VMRUNUJyAmJiAhcGFyZW50Tm9kZS5oYXNBdHRyaWJ1dGUoJ211bHRpcGxlJykpIHtcbiAgICAgICAgICAgICAgICBpZiAoZnJvbUVsLmhhc0F0dHJpYnV0ZSgnc2VsZWN0ZWQnKSAmJiAhdG9FbC5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXb3JrYXJvdW5kIGZvciBNUyBFZGdlIGJ1ZyB3aGVyZSB0aGUgJ3NlbGVjdGVkJyBhdHRyaWJ1dGUgY2FuIG9ubHkgYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gcmVtb3ZlZCBpZiBzZXQgdG8gYSBub24tZW1wdHkgdmFsdWU6XG4gICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1pY3Jvc29mdC5jb20vZW4tdXMvbWljcm9zb2Z0LWVkZ2UvcGxhdGZvcm0vaXNzdWVzLzEyMDg3Njc5L1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICBmcm9tRWwucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBXZSBoYXZlIHRvIHJlc2V0IHNlbGVjdCBlbGVtZW50J3Mgc2VsZWN0ZWRJbmRleCB0byAtMSwgb3RoZXJ3aXNlIHNldHRpbmdcbiAgICAgICAgICAgICAgICAvLyBmcm9tRWwuc2VsZWN0ZWQgdXNpbmcgdGhlIHN5bmNCb29sZWFuQXR0clByb3AgYmVsb3cgaGFzIG5vIGVmZmVjdC5cbiAgICAgICAgICAgICAgICAvLyBUaGUgY29ycmVjdCBzZWxlY3RlZEluZGV4IHdpbGwgYmUgc2V0IGluIHRoZSBTRUxFQ1Qgc3BlY2lhbCBoYW5kbGVyIGJlbG93LlxuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnc2VsZWN0ZWQnKTtcbiAgICB9LFxuICAgIC8qKlxuICAgICAqIFRoZSBcInZhbHVlXCIgYXR0cmlidXRlIGlzIHNwZWNpYWwgZm9yIHRoZSA8aW5wdXQ+IGVsZW1lbnQgc2luY2UgaXQgc2V0c1xuICAgICAqIHRoZSBpbml0aWFsIHZhbHVlLiBDaGFuZ2luZyB0aGUgXCJ2YWx1ZVwiIGF0dHJpYnV0ZSB3aXRob3V0IGNoYW5naW5nIHRoZVxuICAgICAqIFwidmFsdWVcIiBwcm9wZXJ0eSB3aWxsIGhhdmUgbm8gZWZmZWN0IHNpbmNlIGl0IGlzIG9ubHkgdXNlZCB0byB0aGUgc2V0IHRoZVxuICAgICAqIGluaXRpYWwgdmFsdWUuICBTaW1pbGFyIGZvciB0aGUgXCJjaGVja2VkXCIgYXR0cmlidXRlLCBhbmQgXCJkaXNhYmxlZFwiLlxuICAgICAqL1xuICAgIElOUFVUOiBmdW5jdGlvbihmcm9tRWwsIHRvRWwpIHtcbiAgICAgICAgc3luY0Jvb2xlYW5BdHRyUHJvcChmcm9tRWwsIHRvRWwsICdjaGVja2VkJyk7XG4gICAgICAgIHN5bmNCb29sZWFuQXR0clByb3AoZnJvbUVsLCB0b0VsLCAnZGlzYWJsZWQnKTtcblxuICAgICAgICBpZiAoZnJvbUVsLnZhbHVlICE9PSB0b0VsLnZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSB0b0VsLnZhbHVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCF0b0VsLmhhc0F0dHJpYnV0ZSgndmFsdWUnKSkge1xuICAgICAgICAgICAgZnJvbUVsLnJlbW92ZUF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBURVhUQVJFQTogZnVuY3Rpb24oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZSA9IHRvRWwudmFsdWU7XG4gICAgICAgIGlmIChmcm9tRWwudmFsdWUgIT09IG5ld1ZhbHVlKSB7XG4gICAgICAgICAgICBmcm9tRWwudmFsdWUgPSBuZXdWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBmaXJzdENoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgIGlmIChmaXJzdENoaWxkKSB7XG4gICAgICAgICAgICAvLyBOZWVkZWQgZm9yIElFLiBBcHBhcmVudGx5IElFIHNldHMgdGhlIHBsYWNlaG9sZGVyIGFzIHRoZVxuICAgICAgICAgICAgLy8gbm9kZSB2YWx1ZSBhbmQgdmlzZSB2ZXJzYS4gVGhpcyBpZ25vcmVzIGFuIGVtcHR5IHVwZGF0ZS5cbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IGZpcnN0Q2hpbGQubm9kZVZhbHVlO1xuXG4gICAgICAgICAgICBpZiAob2xkVmFsdWUgPT0gbmV3VmFsdWUgfHwgKCFuZXdWYWx1ZSAmJiBvbGRWYWx1ZSA9PSBmcm9tRWwucGxhY2Vob2xkZXIpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmaXJzdENoaWxkLm5vZGVWYWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBTRUxFQ1Q6IGZ1bmN0aW9uKGZyb21FbCwgdG9FbCkge1xuICAgICAgICBpZiAoIXRvRWwuaGFzQXR0cmlidXRlKCdtdWx0aXBsZScpKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJbmRleCA9IC0xO1xuICAgICAgICAgICAgdmFyIGkgPSAwO1xuICAgICAgICAgICAgLy8gV2UgaGF2ZSB0byBsb29wIHRocm91Z2ggY2hpbGRyZW4gb2YgZnJvbUVsLCBub3QgdG9FbCBzaW5jZSBub2RlcyBjYW4gYmUgbW92ZWRcbiAgICAgICAgICAgIC8vIGZyb20gdG9FbCB0byBmcm9tRWwgZGlyZWN0bHkgd2hlbiBtb3JwaGluZy5cbiAgICAgICAgICAgIC8vIEF0IHRoZSB0aW1lIHRoaXMgc3BlY2lhbCBoYW5kbGVyIGlzIGludm9rZWQsIGFsbCBjaGlsZHJlbiBoYXZlIGFscmVhZHkgYmVlbiBtb3JwaGVkXG4gICAgICAgICAgICAvLyBhbmQgYXBwZW5kZWQgdG8gLyByZW1vdmVkIGZyb20gZnJvbUVsLCBzbyB1c2luZyBmcm9tRWwgaGVyZSBpcyBzYWZlIGFuZCBjb3JyZWN0LlxuICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gZnJvbUVsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgb3B0Z3JvdXA7XG4gICAgICAgICAgICB2YXIgbm9kZU5hbWU7XG4gICAgICAgICAgICB3aGlsZShjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgIG5vZGVOYW1lID0gY3VyQ2hpbGQubm9kZU5hbWUgJiYgY3VyQ2hpbGQubm9kZU5hbWUudG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgICAgICBpZiAobm9kZU5hbWUgPT09ICdPUFRHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBjdXJDaGlsZDtcbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBvcHRncm91cC5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChub2RlTmFtZSA9PT0gJ09QVElPTicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5oYXNBdHRyaWJ1dGUoJ3NlbGVjdGVkJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZEluZGV4ID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IGN1ckNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWN1ckNoaWxkICYmIG9wdGdyb3VwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG9wdGdyb3VwLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0Z3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmcm9tRWwuc2VsZWN0ZWRJbmRleCA9IHNlbGVjdGVkSW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG52YXIgRUxFTUVOVF9OT0RFID0gMTtcbnZhciBET0NVTUVOVF9GUkFHTUVOVF9OT0RFJDEgPSAxMTtcbnZhciBURVhUX05PREUgPSAzO1xudmFyIENPTU1FTlRfTk9ERSA9IDg7XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5mdW5jdGlvbiBkZWZhdWx0R2V0Tm9kZUtleShub2RlKSB7XG4gIGlmIChub2RlKSB7XG4gICAgICByZXR1cm4gKG5vZGUuZ2V0QXR0cmlidXRlICYmIG5vZGUuZ2V0QXR0cmlidXRlKCdpZCcpKSB8fCBub2RlLmlkO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1vcnBoZG9tRmFjdG9yeShtb3JwaEF0dHJzKSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbW9ycGhkb20oZnJvbU5vZGUsIHRvTm9kZSwgb3B0aW9ucykge1xuICAgICAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgICAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgdG9Ob2RlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKGZyb21Ob2RlLm5vZGVOYW1lID09PSAnI2RvY3VtZW50JyB8fCBmcm9tTm9kZS5ub2RlTmFtZSA9PT0gJ0hUTUwnIHx8IGZyb21Ob2RlLm5vZGVOYW1lID09PSAnQk9EWScpIHtcbiAgICAgICAgICAgICAgICB2YXIgdG9Ob2RlSHRtbCA9IHRvTm9kZTtcbiAgICAgICAgICAgICAgICB0b05vZGUgPSBkb2MuY3JlYXRlRWxlbWVudCgnaHRtbCcpO1xuICAgICAgICAgICAgICAgIHRvTm9kZS5pbm5lckhUTUwgPSB0b05vZGVIdG1sO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0b05vZGUgPSB0b0VsZW1lbnQodG9Ob2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBnZXROb2RlS2V5ID0gb3B0aW9ucy5nZXROb2RlS2V5IHx8IGRlZmF1bHRHZXROb2RlS2V5O1xuICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZUFkZGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbk5vZGVBZGRlZCA9IG9wdGlvbnMub25Ob2RlQWRkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uQmVmb3JlRWxVcGRhdGVkID0gb3B0aW9ucy5vbkJlZm9yZUVsVXBkYXRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25FbFVwZGF0ZWQgPSBvcHRpb25zLm9uRWxVcGRhdGVkIHx8IG5vb3A7XG4gICAgICAgIHZhciBvbkJlZm9yZU5vZGVEaXNjYXJkZWQgPSBvcHRpb25zLm9uQmVmb3JlTm9kZURpc2NhcmRlZCB8fCBub29wO1xuICAgICAgICB2YXIgb25Ob2RlRGlzY2FyZGVkID0gb3B0aW9ucy5vbk5vZGVEaXNjYXJkZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIG9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgPSBvcHRpb25zLm9uQmVmb3JlRWxDaGlsZHJlblVwZGF0ZWQgfHwgbm9vcDtcbiAgICAgICAgdmFyIGNoaWxkcmVuT25seSA9IG9wdGlvbnMuY2hpbGRyZW5Pbmx5ID09PSB0cnVlO1xuXG4gICAgICAgIC8vIFRoaXMgb2JqZWN0IGlzIHVzZWQgYXMgYSBsb29rdXAgdG8gcXVpY2tseSBmaW5kIGFsbCBrZXllZCBlbGVtZW50cyBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUuXG4gICAgICAgIHZhciBmcm9tTm9kZXNMb29rdXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB2YXIga2V5ZWRSZW1vdmFsTGlzdCA9IFtdO1xuXG4gICAgICAgIGZ1bmN0aW9uIGFkZEtleWVkUmVtb3ZhbChrZXkpIHtcbiAgICAgICAgICAgIGtleWVkUmVtb3ZhbExpc3QucHVzaChrZXkpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMobm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBub2RlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoc2tpcEtleWVkTm9kZXMgJiYgKGtleSA9IGdldE5vZGVLZXkoY3VyQ2hpbGQpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gSWYgd2UgYXJlIHNraXBwaW5nIGtleWVkIG5vZGVzIHRoZW4gd2UgYWRkIHRoZSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRvIGEgbGlzdCBzbyB0aGF0IGl0IGNhbiBiZSBoYW5kbGVkIGF0IHRoZSB2ZXJ5IGVuZC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChrZXkpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT25seSByZXBvcnQgdGhlIG5vZGUgYXMgZGlzY2FyZGVkIGlmIGl0IGlzIG5vdCBrZXllZC4gV2UgZG8gdGhpcyBiZWNhdXNlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBhdCB0aGUgZW5kIHdlIGxvb3AgdGhyb3VnaCBhbGwga2V5ZWQgZWxlbWVudHMgdGhhdCB3ZXJlIHVubWF0Y2hlZFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gYW5kIHRoZW4gZGlzY2FyZCB0aGVtIGluIG9uZSBmaW5hbCBwYXNzLlxuICAgICAgICAgICAgICAgICAgICAgICAgb25Ob2RlRGlzY2FyZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJDaGlsZC5maXJzdENoaWxkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2Fsa0Rpc2NhcmRlZENoaWxkTm9kZXMoY3VyQ2hpbGQsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckNoaWxkID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZXMgYSBET00gbm9kZSBvdXQgb2YgdGhlIG9yaWdpbmFsIERPTVxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSBub2RlIFRoZSBub2RlIHRvIHJlbW92ZVxuICAgICAgICAgKiBAcGFyYW0gIHtOb2RlfSBwYXJlbnROb2RlIFRoZSBub2RlcyBwYXJlbnRcbiAgICAgICAgICogQHBhcmFtICB7Qm9vbGVhbn0gc2tpcEtleWVkTm9kZXMgSWYgdHJ1ZSB0aGVuIGVsZW1lbnRzIHdpdGgga2V5cyB3aWxsIGJlIHNraXBwZWQgYW5kIG5vdCBkaXNjYXJkZWQuXG4gICAgICAgICAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAgICAgICAgICovXG4gICAgICAgIGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSwgcGFyZW50Tm9kZSwgc2tpcEtleWVkTm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVEaXNjYXJkZWQobm9kZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAocGFyZW50Tm9kZSkge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChub2RlKTtcbiAgICAgICAgICAgIHdhbGtEaXNjYXJkZWRDaGlsZE5vZGVzKG5vZGUsIHNraXBLZXllZE5vZGVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC8vIFRyZWVXYWxrZXIgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgICAgIC8vIGZ1bmN0aW9uIGluZGV4VHJlZShyb290KSB7XG4gICAgICAgIC8vICAgICB2YXIgdHJlZVdhbGtlciA9IGRvY3VtZW50LmNyZWF0ZVRyZWVXYWxrZXIoXG4gICAgICAgIC8vICAgICAgICAgcm9vdCxcbiAgICAgICAgLy8gICAgICAgICBOb2RlRmlsdGVyLlNIT1dfRUxFTUVOVCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICB2YXIgZWw7XG4gICAgICAgIC8vICAgICB3aGlsZSgoZWwgPSB0cmVlV2Fsa2VyLm5leHROb2RlKCkpKSB7XG4gICAgICAgIC8vICAgICAgICAgdmFyIGtleSA9IGdldE5vZGVLZXkoZWwpO1xuICAgICAgICAvLyAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgLy8gICAgICAgICAgICAgZnJvbU5vZGVzTG9va3VwW2tleV0gPSBlbDtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyAvLyBOb2RlSXRlcmF0b3IgaW1wbGVtZW50YXRpb24gaXMgbm8gZmFzdGVyLCBidXQga2VlcGluZyB0aGlzIGFyb3VuZCBpbiBjYXNlIHRoaXMgY2hhbmdlcyBpbiB0aGUgZnV0dXJlXG4gICAgICAgIC8vXG4gICAgICAgIC8vIGZ1bmN0aW9uIGluZGV4VHJlZShub2RlKSB7XG4gICAgICAgIC8vICAgICB2YXIgbm9kZUl0ZXJhdG9yID0gZG9jdW1lbnQuY3JlYXRlTm9kZUl0ZXJhdG9yKG5vZGUsIE5vZGVGaWx0ZXIuU0hPV19FTEVNRU5UKTtcbiAgICAgICAgLy8gICAgIHZhciBlbDtcbiAgICAgICAgLy8gICAgIHdoaWxlKChlbCA9IG5vZGVJdGVyYXRvci5uZXh0Tm9kZSgpKSkge1xuICAgICAgICAvLyAgICAgICAgIHZhciBrZXkgPSBnZXROb2RlS2V5KGVsKTtcbiAgICAgICAgLy8gICAgICAgICBpZiAoa2V5KSB7XG4gICAgICAgIC8vICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gZWw7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfVxuICAgICAgICAvLyB9XG5cbiAgICAgICAgZnVuY3Rpb24gaW5kZXhUcmVlKG5vZGUpIHtcbiAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlID09PSBFTEVNRU5UX05PREUgfHwgbm9kZS5ub2RlVHlwZSA9PT0gRE9DVU1FTlRfRlJBR01FTlRfTk9ERSQxKSB7XG4gICAgICAgICAgICAgICAgdmFyIGN1ckNoaWxkID0gbm9kZS5maXJzdENoaWxkO1xuICAgICAgICAgICAgICAgIHdoaWxlIChjdXJDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyb21Ob2Rlc0xvb2t1cFtrZXldID0gY3VyQ2hpbGQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBXYWxrIHJlY3Vyc2l2ZWx5XG4gICAgICAgICAgICAgICAgICAgIGluZGV4VHJlZShjdXJDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgY3VyQ2hpbGQgPSBjdXJDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpbmRleFRyZWUoZnJvbU5vZGUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZU5vZGVBZGRlZChlbCkge1xuICAgICAgICAgICAgb25Ob2RlQWRkZWQoZWwpO1xuXG4gICAgICAgICAgICB2YXIgY3VyQ2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgd2hpbGUgKGN1ckNoaWxkKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY3VyQ2hpbGQubmV4dFNpYmxpbmc7XG5cbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gZ2V0Tm9kZUtleShjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgdW5tYXRjaGVkRnJvbUVsID0gZnJvbU5vZGVzTG9va3VwW2tleV07XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHdlIGZpbmQgYSBkdXBsaWNhdGUgI2lkIG5vZGUgaW4gY2FjaGUsIHJlcGxhY2UgYGVsYCB3aXRoIGNhY2hlIHZhbHVlXG4gICAgICAgICAgICAgICAgICAgIC8vIGFuZCBtb3JwaCBpdCB0byB0aGUgY2hpbGQgbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHVubWF0Y2hlZEZyb21FbCAmJiBjb21wYXJlTm9kZU5hbWVzKGN1ckNoaWxkLCB1bm1hdGNoZWRGcm9tRWwpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJDaGlsZC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh1bm1hdGNoZWRGcm9tRWwsIGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vcnBoRWwodW5tYXRjaGVkRnJvbUVsLCBjdXJDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAvLyByZWN1cnNpdmVseSBjYWxsIGZvciBjdXJDaGlsZCBhbmQgaXQncyBjaGlsZHJlbiB0byBzZWUgaWYgd2UgZmluZCBzb21ldGhpbmcgaW5cbiAgICAgICAgICAgICAgICAgIC8vIGZyb21Ob2Rlc0xvb2t1cFxuICAgICAgICAgICAgICAgICAgaGFuZGxlTm9kZUFkZGVkKGN1ckNoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJDaGlsZCA9IG5leHRTaWJsaW5nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAvLyBXZSBoYXZlIHByb2Nlc3NlZCBhbGwgb2YgdGhlIFwidG8gbm9kZXNcIi4gSWYgY3VyRnJvbU5vZGVDaGlsZCBpc1xuICAgICAgICAgICAgLy8gbm9uLW51bGwgdGhlbiB3ZSBzdGlsbCBoYXZlIHNvbWUgZnJvbSBub2RlcyBsZWZ0IG92ZXIgdGhhdCBuZWVkXG4gICAgICAgICAgICAvLyB0byBiZSByZW1vdmVkXG4gICAgICAgICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIHZhciBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgIGlmICgoY3VyRnJvbU5vZGVLZXkgPSBnZXROb2RlS2V5KGN1ckZyb21Ob2RlQ2hpbGQpKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICBhZGRLZXllZFJlbW92YWwoY3VyRnJvbU5vZGVLZXkpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICBzdGlsbCBhIGNoYW5jZSB0aGV5IHdpbGwgYmUgbWF0Y2hlZCB1cCBsYXRlclxuICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vcnBoRWwoZnJvbUVsLCB0b0VsLCBjaGlsZHJlbk9ubHkpIHtcbiAgICAgICAgICAgIHZhciB0b0VsS2V5ID0gZ2V0Tm9kZUtleSh0b0VsKTtcblxuICAgICAgICAgICAgaWYgKHRvRWxLZXkpIHtcbiAgICAgICAgICAgICAgICAvLyBJZiBhbiBlbGVtZW50IHdpdGggYW4gSUQgaXMgYmVpbmcgbW9ycGhlZCB0aGVuIGl0IHdpbGwgYmUgaW4gdGhlIGZpbmFsXG4gICAgICAgICAgICAgICAgLy8gRE9NIHNvIGNsZWFyIGl0IG91dCBvZiB0aGUgc2F2ZWQgZWxlbWVudHMgY29sbGVjdGlvblxuICAgICAgICAgICAgICAgIGRlbGV0ZSBmcm9tTm9kZXNMb29rdXBbdG9FbEtleV07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghY2hpbGRyZW5Pbmx5KSB7XG4gICAgICAgICAgICAgICAgLy8gb3B0aW9uYWxcbiAgICAgICAgICAgICAgICBpZiAob25CZWZvcmVFbFVwZGF0ZWQoZnJvbUVsLCB0b0VsKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSBhdHRyaWJ1dGVzIG9uIG9yaWdpbmFsIERPTSBlbGVtZW50IGZpcnN0XG4gICAgICAgICAgICAgICAgbW9ycGhBdHRycyhmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgICAgICAgICAgb25FbFVwZGF0ZWQoZnJvbUVsKTtcblxuICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZUVsQ2hpbGRyZW5VcGRhdGVkKGZyb21FbCwgdG9FbCkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChmcm9tRWwubm9kZU5hbWUgIT09ICdURVhUQVJFQScpIHtcbiAgICAgICAgICAgICAgbW9ycGhDaGlsZHJlbihmcm9tRWwsIHRvRWwpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgc3BlY2lhbEVsSGFuZGxlcnMuVEVYVEFSRUEoZnJvbUVsLCB0b0VsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIG1vcnBoQ2hpbGRyZW4oZnJvbUVsLCB0b0VsKSB7XG4gICAgICAgICAgICB2YXIgY3VyVG9Ob2RlQ2hpbGQgPSB0b0VsLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21FbC5maXJzdENoaWxkO1xuICAgICAgICAgICAgdmFyIGN1clRvTm9kZUtleTtcbiAgICAgICAgICAgIHZhciBjdXJGcm9tTm9kZUtleTtcblxuICAgICAgICAgICAgdmFyIGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIHZhciB0b05leHRTaWJsaW5nO1xuICAgICAgICAgICAgdmFyIG1hdGNoaW5nRnJvbUVsO1xuXG4gICAgICAgICAgICAvLyB3YWxrIHRoZSBjaGlsZHJlblxuICAgICAgICAgICAgb3V0ZXI6IHdoaWxlIChjdXJUb05vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgIHRvTmV4dFNpYmxpbmcgPSBjdXJUb05vZGVDaGlsZC5uZXh0U2libGluZztcbiAgICAgICAgICAgICAgICBjdXJUb05vZGVLZXkgPSBnZXROb2RlS2V5KGN1clRvTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgIC8vIHdhbGsgdGhlIGZyb21Ob2RlIGNoaWxkcmVuIGFsbCB0aGUgd2F5IHRocm91Z2hcbiAgICAgICAgICAgICAgICB3aGlsZSAoY3VyRnJvbU5vZGVDaGlsZCkge1xuICAgICAgICAgICAgICAgICAgICBmcm9tTmV4dFNpYmxpbmcgPSBjdXJGcm9tTm9kZUNoaWxkLm5leHRTaWJsaW5nO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5pc1NhbWVOb2RlICYmIGN1clRvTm9kZUNoaWxkLmlzU2FtZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gdG9OZXh0U2libGluZztcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlS2V5ID0gZ2V0Tm9kZUtleShjdXJGcm9tTm9kZUNoaWxkKTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgY3VyRnJvbU5vZGVUeXBlID0gY3VyRnJvbU5vZGVDaGlsZC5ub2RlVHlwZTtcblxuICAgICAgICAgICAgICAgICAgICAvLyB0aGlzIG1lYW5zIGlmIHRoZSBjdXJGcm9tTm9kZUNoaWxkIGRvZXNudCBoYXZlIGEgbWF0Y2ggd2l0aCB0aGUgY3VyVG9Ob2RlQ2hpbGRcbiAgICAgICAgICAgICAgICAgICAgdmFyIGlzQ29tcGF0aWJsZSA9IHVuZGVmaW5lZDtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVUeXBlID09PSBjdXJUb05vZGVDaGlsZC5ub2RlVHlwZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gQm90aCBub2RlcyBiZWluZyBjb21wYXJlZCBhcmUgRWxlbWVudCBub2Rlc1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgdGFyZ2V0IG5vZGUgaGFzIGEga2V5IHNvIHdlIHdhbnQgdG8gbWF0Y2ggaXQgdXAgd2l0aCB0aGUgY29ycmVjdCBlbGVtZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyVG9Ob2RlS2V5ICE9PSBjdXJGcm9tTm9kZUtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIGN1cnJlbnQgZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgRE9NIHRyZWUgZG9lcyBub3QgaGF2ZSBhIG1hdGNoaW5nIGtleSBzb1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbGV0J3MgY2hlY2sgb3VyIGxvb2t1cCB0byBzZWUgaWYgdGhlcmUgaXMgYSBtYXRjaGluZyBlbGVtZW50IGluIHRoZSBvcmlnaW5hbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIHRyZWVcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnJvbU5leHRTaWJsaW5nID09PSBtYXRjaGluZ0Zyb21FbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHNpbmdsZSBlbGVtZW50IHJlbW92YWxzLiBUbyBhdm9pZCByZW1vdmluZyB0aGUgb3JpZ2luYWxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gRE9NIG5vZGUgb3V0IG9mIHRoZSB0cmVlIChzaW5jZSB0aGF0IGNhbiBicmVhayBDU1MgdHJhbnNpdGlvbnMsIGV0Yy4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3ZSB3aWxsIGluc3RlYWQgZGlzY2FyZCB0aGUgY3VycmVudCBub2RlIGFuZCB3YWl0IHVudGlsIHRoZSBuZXh0XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGl0ZXJhdGlvbiB0byBwcm9wZXJseSBtYXRjaCB1cCB0aGUga2V5ZWQgdGFyZ2V0IGVsZW1lbnQgd2l0aCBpdHMgbWF0Y2hpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlbWVudCBpbiB0aGUgb3JpZ2luYWwgdHJlZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBhIG1hdGNoaW5nIGtleWVkIGVsZW1lbnQgc29tZXdoZXJlIGluIHRoZSBvcmlnaW5hbCBET00gdHJlZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTGV0J3MgbW92ZSB0aGUgb3JpZ2luYWwgRE9NIG5vZGUgaW50byB0aGUgY3VycmVudCBwb3NpdGlvbiBhbmQgbW9ycGhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gaXQuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTk9URTogV2UgdXNlIGluc2VydEJlZm9yZSBpbnN0ZWFkIG9mIHJlcGxhY2VDaGlsZCBiZWNhdXNlIHdlIHdhbnQgdG8gZ28gdGhyb3VnaFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYHJlbW92ZU5vZGUoKWAgZnVuY3Rpb24gZm9yIHRoZSBub2RlIHRoYXQgaXMgYmVpbmcgZGlzY2FyZGVkIHNvIHRoYXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYWxsIGxpZmVjeWNsZSBob29rcyBhcmUgY29ycmVjdGx5IGludm9rZWRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmluc2VydEJlZm9yZShtYXRjaGluZ0Zyb21FbCwgY3VyRnJvbU5vZGVDaGlsZCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gZnJvbU5leHRTaWJsaW5nID0gY3VyRnJvbU5vZGVDaGlsZC5uZXh0U2libGluZztcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoY3VyRnJvbU5vZGVLZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbmNlIHRoZSBub2RlIGlzIGtleWVkIGl0IG1pZ2h0IGJlIG1hdGNoZWQgdXAgbGF0ZXIgc28gd2UgZGVmZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoZSBhY3R1YWwgcmVtb3ZhbCB0byBsYXRlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRkS2V5ZWRSZW1vdmFsKGN1ckZyb21Ob2RlS2V5KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5PVEU6IHdlIHNraXAgbmVzdGVkIGtleWVkIG5vZGVzIGZyb20gYmVpbmcgcmVtb3ZlZCBzaW5jZSB0aGVyZSBpc1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgc3RpbGwgYSBjaGFuY2UgdGhleSB3aWxsIGJlIG1hdGNoZWQgdXAgbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZU5vZGUoY3VyRnJvbU5vZGVDaGlsZCwgZnJvbUVsLCB0cnVlIC8qIHNraXAga2V5ZWQgbm9kZXMgKi8pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IG1hdGNoaW5nRnJvbUVsO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIG5vZGVzIGFyZSBub3QgY29tcGF0aWJsZSBzaW5jZSB0aGUgXCJ0b1wiIG5vZGUgaGFzIGEga2V5IGFuZCB0aGVyZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGlzIG5vIG1hdGNoaW5nIGtleWVkIG5vZGUgaW4gdGhlIHNvdXJjZSB0cmVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRoZSBvcmlnaW5hbCBoYXMgYSBrZXlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNDb21wYXRpYmxlID0gaXNDb21wYXRpYmxlICE9PSBmYWxzZSAmJiBjb21wYXJlTm9kZU5hbWVzKGN1ckZyb21Ob2RlQ2hpbGQsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFdlIGZvdW5kIGNvbXBhdGlibGUgRE9NIGVsZW1lbnRzIHNvIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgY3VycmVudCBcImZyb21cIiBub2RlIHRvIG1hdGNoIHRoZSBjdXJyZW50XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRhcmdldCBET00gbm9kZS5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gTU9SUEhcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhFbChjdXJGcm9tTm9kZUNoaWxkLCBjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGN1ckZyb21Ob2RlVHlwZSA9PT0gVEVYVF9OT0RFIHx8IGN1ckZyb21Ob2RlVHlwZSA9PSBDT01NRU5UX05PREUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBCb3RoIG5vZGVzIGJlaW5nIGNvbXBhcmVkIGFyZSBUZXh0IG9yIENvbW1lbnQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc0NvbXBhdGlibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIFNpbXBseSB1cGRhdGUgbm9kZVZhbHVlIG9uIHRoZSBvcmlnaW5hbCBub2RlIHRvXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2hhbmdlIHRoZSB0ZXh0IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlQ2hpbGQubm9kZVZhbHVlICE9PSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZC5ub2RlVmFsdWUgPSBjdXJUb05vZGVDaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNDb21wYXRpYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBBZHZhbmNlIGJvdGggdGhlIFwidG9cIiBjaGlsZCBhbmQgdGhlIFwiZnJvbVwiIGNoaWxkIHNpbmNlIHdlIGZvdW5kIGEgbWF0Y2hcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGhpbmcgZWxzZSB0byBkbyBhcyB3ZSBhbHJlYWR5IHJlY3Vyc2l2ZWx5IGNhbGxlZCBtb3JwaENoaWxkcmVuIGFib3ZlXG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXJGcm9tTm9kZUNoaWxkID0gZnJvbU5leHRTaWJsaW5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWUgb3V0ZXI7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvLyBObyBjb21wYXRpYmxlIG1hdGNoIHNvIHJlbW92ZSB0aGUgb2xkIG5vZGUgZnJvbSB0aGUgRE9NIGFuZCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhXG4gICAgICAgICAgICAgICAgICAgIC8vIG1hdGNoIGluIHRoZSBvcmlnaW5hbCBET00uIEhvd2V2ZXIsIHdlIG9ubHkgZG8gdGhpcyBpZiB0aGUgZnJvbSBub2RlIGlzIG5vdCBrZXllZFxuICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSBpdCBpcyBwb3NzaWJsZSB0aGF0IGEga2V5ZWQgbm9kZSBtaWdodCBtYXRjaCB1cCB3aXRoIGEgbm9kZSBzb21ld2hlcmUgZWxzZSBpbiB0aGVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGFyZ2V0IHRyZWUgYW5kIHdlIGRvbid0IHdhbnQgdG8gZGlzY2FyZCBpdCBqdXN0IHlldCBzaW5jZSBpdCBzdGlsbCBtaWdodCBmaW5kIGFcbiAgICAgICAgICAgICAgICAgICAgLy8gaG9tZSBpbiB0aGUgZmluYWwgRE9NIHRyZWUuIEFmdGVyIGV2ZXJ5dGhpbmcgaXMgZG9uZSB3ZSB3aWxsIHJlbW92ZSBhbnkga2V5ZWQgbm9kZXNcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhhdCBkaWRuJ3QgZmluZCBhIGhvbWVcbiAgICAgICAgICAgICAgICAgICAgaWYgKGN1ckZyb21Ob2RlS2V5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTaW5jZSB0aGUgbm9kZSBpcyBrZXllZCBpdCBtaWdodCBiZSBtYXRjaGVkIHVwIGxhdGVyIHNvIHdlIGRlZmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgYWN0dWFsIHJlbW92YWwgdG8gbGF0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFkZEtleWVkUmVtb3ZhbChjdXJGcm9tTm9kZUtleSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBOT1RFOiB3ZSBza2lwIG5lc3RlZCBrZXllZCBub2RlcyBmcm9tIGJlaW5nIHJlbW92ZWQgc2luY2UgdGhlcmUgaXNcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vICAgICAgIHN0aWxsIGEgY2hhbmNlIHRoZXkgd2lsbCBiZSBtYXRjaGVkIHVwIGxhdGVyXG4gICAgICAgICAgICAgICAgICAgICAgICByZW1vdmVOb2RlKGN1ckZyb21Ob2RlQ2hpbGQsIGZyb21FbCwgdHJ1ZSAvKiBza2lwIGtleWVkIG5vZGVzICovKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGN1ckZyb21Ob2RlQ2hpbGQgPSBmcm9tTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgfSAvLyBFTkQ6IHdoaWxlKGN1ckZyb21Ob2RlQ2hpbGQpIHt9XG5cbiAgICAgICAgICAgICAgICAvLyBJZiB3ZSBnb3QgdGhpcyBmYXIgdGhlbiB3ZSBkaWQgbm90IGZpbmQgYSBjYW5kaWRhdGUgbWF0Y2ggZm9yXG4gICAgICAgICAgICAgICAgLy8gb3VyIFwidG8gbm9kZVwiIGFuZCB3ZSBleGhhdXN0ZWQgYWxsIG9mIHRoZSBjaGlsZHJlbiBcImZyb21cIlxuICAgICAgICAgICAgICAgIC8vIG5vZGVzLiBUaGVyZWZvcmUsIHdlIHdpbGwganVzdCBhcHBlbmQgdGhlIGN1cnJlbnQgXCJ0b1wiIG5vZGVcbiAgICAgICAgICAgICAgICAvLyB0byB0aGUgZW5kXG4gICAgICAgICAgICAgICAgaWYgKGN1clRvTm9kZUtleSAmJiAobWF0Y2hpbmdGcm9tRWwgPSBmcm9tTm9kZXNMb29rdXBbY3VyVG9Ob2RlS2V5XSkgJiYgY29tcGFyZU5vZGVOYW1lcyhtYXRjaGluZ0Zyb21FbCwgY3VyVG9Ob2RlQ2hpbGQpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZyb21FbC5hcHBlbmRDaGlsZChtYXRjaGluZ0Zyb21FbCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIE1PUlBIXG4gICAgICAgICAgICAgICAgICAgIG1vcnBoRWwobWF0Y2hpbmdGcm9tRWwsIGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQgPSBvbkJlZm9yZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvbkJlZm9yZU5vZGVBZGRlZFJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGN1clRvTm9kZUNoaWxkID0gb25CZWZvcmVOb2RlQWRkZWRSZXN1bHQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJUb05vZGVDaGlsZC5hY3R1YWxpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IGN1clRvTm9kZUNoaWxkLmFjdHVhbGl6ZShmcm9tRWwub3duZXJEb2N1bWVudCB8fCBkb2MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbUVsLmFwcGVuZENoaWxkKGN1clRvTm9kZUNoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhhbmRsZU5vZGVBZGRlZChjdXJUb05vZGVDaGlsZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjdXJUb05vZGVDaGlsZCA9IHRvTmV4dFNpYmxpbmc7XG4gICAgICAgICAgICAgICAgY3VyRnJvbU5vZGVDaGlsZCA9IGZyb21OZXh0U2libGluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY2xlYW51cEZyb21FbChmcm9tRWwsIGN1ckZyb21Ob2RlQ2hpbGQsIGN1ckZyb21Ob2RlS2V5KTtcblxuICAgICAgICAgICAgdmFyIHNwZWNpYWxFbEhhbmRsZXIgPSBzcGVjaWFsRWxIYW5kbGVyc1tmcm9tRWwubm9kZU5hbWVdO1xuICAgICAgICAgICAgaWYgKHNwZWNpYWxFbEhhbmRsZXIpIHtcbiAgICAgICAgICAgICAgICBzcGVjaWFsRWxIYW5kbGVyKGZyb21FbCwgdG9FbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gLy8gRU5EOiBtb3JwaENoaWxkcmVuKC4uLilcblxuICAgICAgICB2YXIgbW9ycGhlZE5vZGUgPSBmcm9tTm9kZTtcbiAgICAgICAgdmFyIG1vcnBoZWROb2RlVHlwZSA9IG1vcnBoZWROb2RlLm5vZGVUeXBlO1xuICAgICAgICB2YXIgdG9Ob2RlVHlwZSA9IHRvTm9kZS5ub2RlVHlwZTtcblxuICAgICAgICBpZiAoIWNoaWxkcmVuT25seSkge1xuICAgICAgICAgICAgLy8gSGFuZGxlIHRoZSBjYXNlIHdoZXJlIHdlIGFyZSBnaXZlbiB0d28gRE9NIG5vZGVzIHRoYXQgYXJlIG5vdFxuICAgICAgICAgICAgLy8gY29tcGF0aWJsZSAoZS5nLiA8ZGl2PiAtLT4gPHNwYW4+IG9yIDxkaXY+IC0tPiBURVhUKVxuICAgICAgICAgICAgaWYgKG1vcnBoZWROb2RlVHlwZSA9PT0gRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRvTm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWNvbXBhcmVOb2RlTmFtZXMoZnJvbU5vZGUsIHRvTm9kZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uTm9kZURpc2NhcmRlZChmcm9tTm9kZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBtb3JwaGVkTm9kZSA9IG1vdmVDaGlsZHJlbihmcm9tTm9kZSwgY3JlYXRlRWxlbWVudE5TKHRvTm9kZS5ub2RlTmFtZSwgdG9Ob2RlLm5hbWVzcGFjZVVSSSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gR29pbmcgZnJvbSBhbiBlbGVtZW50IG5vZGUgdG8gYSB0ZXh0IG5vZGVcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmIChtb3JwaGVkTm9kZVR5cGUgPT09IFRFWFRfTk9ERSB8fCBtb3JwaGVkTm9kZVR5cGUgPT09IENPTU1FTlRfTk9ERSkgeyAvLyBUZXh0IG9yIGNvbW1lbnQgbm9kZVxuICAgICAgICAgICAgICAgIGlmICh0b05vZGVUeXBlID09PSBtb3JwaGVkTm9kZVR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG1vcnBoZWROb2RlLm5vZGVWYWx1ZSAhPT0gdG9Ob2RlLm5vZGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUubm9kZVZhbHVlID0gdG9Ob2RlLm5vZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvLyBUZXh0IG5vZGUgdG8gc29tZXRoaW5nIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSB0b05vZGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG1vcnBoZWROb2RlID09PSB0b05vZGUpIHtcbiAgICAgICAgICAgIC8vIFRoZSBcInRvIG5vZGVcIiB3YXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgXCJmcm9tIG5vZGVcIiBzbyB3ZSBoYWQgdG9cbiAgICAgICAgICAgIC8vIHRvc3Mgb3V0IHRoZSBcImZyb20gbm9kZVwiIGFuZCB1c2UgdGhlIFwidG8gbm9kZVwiXG4gICAgICAgICAgICBvbk5vZGVEaXNjYXJkZWQoZnJvbU5vZGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRvTm9kZS5pc1NhbWVOb2RlICYmIHRvTm9kZS5pc1NhbWVOb2RlKG1vcnBoZWROb2RlKSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbW9ycGhFbChtb3JwaGVkTm9kZSwgdG9Ob2RlLCBjaGlsZHJlbk9ubHkpO1xuXG4gICAgICAgICAgICAvLyBXZSBub3cgbmVlZCB0byBsb29wIG92ZXIgYW55IGtleWVkIG5vZGVzIHRoYXQgbWlnaHQgbmVlZCB0byBiZVxuICAgICAgICAgICAgLy8gcmVtb3ZlZC4gV2Ugb25seSBkbyB0aGUgcmVtb3ZhbCBpZiB3ZSBrbm93IHRoYXQgdGhlIGtleWVkIG5vZGVcbiAgICAgICAgICAgIC8vIG5ldmVyIGZvdW5kIGEgbWF0Y2guIFdoZW4gYSBrZXllZCBub2RlIGlzIG1hdGNoZWQgdXAgd2UgcmVtb3ZlXG4gICAgICAgICAgICAvLyBpdCBvdXQgb2YgZnJvbU5vZGVzTG9va3VwIGFuZCB3ZSB1c2UgZnJvbU5vZGVzTG9va3VwIHRvIGRldGVybWluZVxuICAgICAgICAgICAgLy8gaWYgYSBrZXllZCBub2RlIGhhcyBiZWVuIG1hdGNoZWQgdXAgb3Igbm90XG4gICAgICAgICAgICBpZiAoa2V5ZWRSZW1vdmFsTGlzdCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGk9MCwgbGVuPWtleWVkUmVtb3ZhbExpc3QubGVuZ3RoOyBpPGxlbjsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBlbFRvUmVtb3ZlID0gZnJvbU5vZGVzTG9va3VwW2tleWVkUmVtb3ZhbExpc3RbaV1dO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZWxUb1JlbW92ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlTm9kZShlbFRvUmVtb3ZlLCBlbFRvUmVtb3ZlLnBhcmVudE5vZGUsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY2hpbGRyZW5Pbmx5ICYmIG1vcnBoZWROb2RlICE9PSBmcm9tTm9kZSAmJiBmcm9tTm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBpZiAobW9ycGhlZE5vZGUuYWN0dWFsaXplKSB7XG4gICAgICAgICAgICAgICAgbW9ycGhlZE5vZGUgPSBtb3JwaGVkTm9kZS5hY3R1YWxpemUoZnJvbU5vZGUub3duZXJEb2N1bWVudCB8fCBkb2MpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gSWYgd2UgaGFkIHRvIHN3YXAgb3V0IHRoZSBmcm9tIG5vZGUgd2l0aCBhIG5ldyBub2RlIGJlY2F1c2UgdGhlIG9sZFxuICAgICAgICAgICAgLy8gbm9kZSB3YXMgbm90IGNvbXBhdGlibGUgd2l0aCB0aGUgdGFyZ2V0IG5vZGUgdGhlbiB3ZSBuZWVkIHRvXG4gICAgICAgICAgICAvLyByZXBsYWNlIHRoZSBvbGQgRE9NIG5vZGUgaW4gdGhlIG9yaWdpbmFsIERPTSB0cmVlLiBUaGlzIGlzIG9ubHlcbiAgICAgICAgICAgIC8vIHBvc3NpYmxlIGlmIHRoZSBvcmlnaW5hbCBET00gbm9kZSB3YXMgcGFydCBvZiBhIERPTSB0cmVlIHdoaWNoXG4gICAgICAgICAgICAvLyB3ZSBrbm93IGlzIHRoZSBjYXNlIGlmIGl0IGhhcyBhIHBhcmVudCBub2RlLlxuICAgICAgICAgICAgZnJvbU5vZGUucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQobW9ycGhlZE5vZGUsIGZyb21Ob2RlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtb3JwaGVkTm9kZTtcbiAgICB9O1xufVxuXG52YXIgbW9ycGhkb20gPSBtb3JwaGRvbUZhY3RvcnkobW9ycGhBdHRycyk7XG5cbmV4cG9ydCBkZWZhdWx0IG1vcnBoZG9tO1xuIiwgImltcG9ydCB7XG4gIFBIWF9DT01QT05FTlQsXG4gIFBIWF9ESVNBQkxFX1dJVEgsXG4gIFBIWF9GRUVEQkFDS19GT1IsXG4gIFBIWF9QUlVORSxcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9TRVNTSU9OLFxuICBQSFhfU0tJUCxcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSSUdHRVJfQUNUSU9OLFxuICBQSFhfVVBEQVRFXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGRldGVjdER1cGxpY2F0ZUlkcyxcbiAgaXNDaWRcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5pbXBvcnQgRE9NIGZyb20gXCIuL2RvbVwiXG5pbXBvcnQgRE9NUG9zdE1vcnBoUmVzdG9yZXIgZnJvbSBcIi4vZG9tX3Bvc3RfbW9ycGhfcmVzdG9yZXJcIlxuaW1wb3J0IG1vcnBoZG9tIGZyb20gXCJtb3JwaGRvbVwiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERPTVBhdGNoIHtcbiAgc3RhdGljIHBhdGNoRWwoZnJvbUVsLCB0b0VsLCBhY3RpdmVFbGVtZW50KXtcbiAgICBtb3JwaGRvbShmcm9tRWwsIHRvRWwsIHtcbiAgICAgIGNoaWxkcmVuT25seTogZmFsc2UsXG4gICAgICBvbkJlZm9yZUVsVXBkYXRlZDogKGZyb21FbCwgdG9FbCkgPT4ge1xuICAgICAgICBpZihhY3RpdmVFbGVtZW50ICYmIGFjdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShmcm9tRWwpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpKXtcbiAgICAgICAgICBET00ubWVyZ2VGb2N1c2VkSW5wdXQoZnJvbUVsLCB0b0VsKVxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHZpZXcsIGNvbnRhaW5lciwgaWQsIGh0bWwsIHRhcmdldENJRCl7XG4gICAgdGhpcy52aWV3ID0gdmlld1xuICAgIHRoaXMubGl2ZVNvY2tldCA9IHZpZXcubGl2ZVNvY2tldFxuICAgIHRoaXMuY29udGFpbmVyID0gY29udGFpbmVyXG4gICAgdGhpcy5pZCA9IGlkXG4gICAgdGhpcy5yb290SUQgPSB2aWV3LnJvb3QuaWRcbiAgICB0aGlzLmh0bWwgPSBodG1sXG4gICAgdGhpcy50YXJnZXRDSUQgPSB0YXJnZXRDSURcbiAgICB0aGlzLmNpZFBhdGNoID0gaXNDaWQodGhpcy50YXJnZXRDSUQpXG4gICAgdGhpcy5jYWxsYmFja3MgPSB7XG4gICAgICBiZWZvcmVhZGRlZDogW10sIGJlZm9yZXVwZGF0ZWQ6IFtdLCBiZWZvcmVwaHhDaGlsZEFkZGVkOiBbXSxcbiAgICAgIGFmdGVyYWRkZWQ6IFtdLCBhZnRlcnVwZGF0ZWQ6IFtdLCBhZnRlcmRpc2NhcmRlZDogW10sIGFmdGVycGh4Q2hpbGRBZGRlZDogW10sXG4gICAgICBhZnRlcnRyYW5zaXRpb25zRGlzY2FyZGVkOiBbXVxuICAgIH1cbiAgfVxuXG4gIGJlZm9yZShraW5kLCBjYWxsYmFjayl7IHRoaXMuY2FsbGJhY2tzW2BiZWZvcmUke2tpbmR9YF0ucHVzaChjYWxsYmFjaykgfVxuICBhZnRlcihraW5kLCBjYWxsYmFjayl7IHRoaXMuY2FsbGJhY2tzW2BhZnRlciR7a2luZH1gXS5wdXNoKGNhbGxiYWNrKSB9XG5cbiAgdHJhY2tCZWZvcmUoa2luZCwgLi4uYXJncyl7XG4gICAgdGhpcy5jYWxsYmFja3NbYGJlZm9yZSR7a2luZH1gXS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKC4uLmFyZ3MpKVxuICB9XG5cbiAgdHJhY2tBZnRlcihraW5kLCAuLi5hcmdzKXtcbiAgICB0aGlzLmNhbGxiYWNrc1tgYWZ0ZXIke2tpbmR9YF0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayguLi5hcmdzKSlcbiAgfVxuXG4gIG1hcmtQcnVuYWJsZUNvbnRlbnRGb3JSZW1vdmFsKCl7XG4gICAgRE9NLmFsbCh0aGlzLmNvbnRhaW5lciwgXCJbcGh4LXVwZGF0ZT1hcHBlbmRdID4gKiwgW3BoeC11cGRhdGU9cHJlcGVuZF0gPiAqXCIsIGVsID0+IHtcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfUFJVTkUsIFwiXCIpXG4gICAgfSlcbiAgfVxuXG4gIHBlcmZvcm0oKXtcbiAgICBsZXQge3ZpZXcsIGxpdmVTb2NrZXQsIGNvbnRhaW5lciwgaHRtbH0gPSB0aGlzXG4gICAgbGV0IHRhcmdldENvbnRhaW5lciA9IHRoaXMuaXNDSURQYXRjaCgpID8gdGhpcy50YXJnZXRDSURDb250YWluZXIoaHRtbCkgOiBjb250YWluZXJcbiAgICBpZih0aGlzLmlzQ0lEUGF0Y2goKSAmJiAhdGFyZ2V0Q29udGFpbmVyKXsgcmV0dXJuIH1cblxuICAgIGxldCBmb2N1c2VkID0gbGl2ZVNvY2tldC5nZXRBY3RpdmVFbGVtZW50KClcbiAgICBsZXQge3NlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmR9ID0gZm9jdXNlZCAmJiBET00uaGFzU2VsZWN0aW9uUmFuZ2UoZm9jdXNlZCkgPyBmb2N1c2VkIDoge31cbiAgICBsZXQgcGh4VXBkYXRlID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9VUERBVEUpXG4gICAgbGV0IHBoeEZlZWRiYWNrRm9yID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9GRUVEQkFDS19GT1IpXG4gICAgbGV0IGRpc2FibGVXaXRoID0gbGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpXG4gICAgbGV0IHBoeFRyaWdnZXJFeHRlcm5hbCA9IGxpdmVTb2NrZXQuYmluZGluZyhQSFhfVFJJR0dFUl9BQ1RJT04pXG4gICAgbGV0IHBoeFJlbW92ZSA9IGxpdmVTb2NrZXQuYmluZGluZyhcInJlbW92ZVwiKVxuICAgIGxldCBhZGRlZCA9IFtdXG4gICAgbGV0IHVwZGF0ZXMgPSBbXVxuICAgIGxldCBhcHBlbmRQcmVwZW5kVXBkYXRlcyA9IFtdXG4gICAgbGV0IHBlbmRpbmdSZW1vdmVzID0gW11cbiAgICBsZXQgZXh0ZXJuYWxGb3JtVHJpZ2dlcmVkID0gbnVsbFxuXG4gICAgbGV0IGRpZmZIVE1MID0gbGl2ZVNvY2tldC50aW1lKFwicHJlbW9ycGggY29udGFpbmVyIHByZXBcIiwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuYnVpbGREaWZmSFRNTChjb250YWluZXIsIGh0bWwsIHBoeFVwZGF0ZSwgdGFyZ2V0Q29udGFpbmVyKVxuICAgIH0pXG5cbiAgICB0aGlzLnRyYWNrQmVmb3JlKFwiYWRkZWRcIiwgY29udGFpbmVyKVxuICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGNvbnRhaW5lciwgY29udGFpbmVyKVxuXG4gICAgbGl2ZVNvY2tldC50aW1lKFwibW9ycGhkb21cIiwgKCkgPT4ge1xuICAgICAgbW9ycGhkb20odGFyZ2V0Q29udGFpbmVyLCBkaWZmSFRNTCwge1xuICAgICAgICBjaGlsZHJlbk9ubHk6IHRhcmdldENvbnRhaW5lci5nZXRBdHRyaWJ1dGUoUEhYX0NPTVBPTkVOVCkgPT09IG51bGwsXG4gICAgICAgIGdldE5vZGVLZXk6IChub2RlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIERPTS5pc1BoeERlc3Ryb3llZChub2RlKSA/IG51bGwgOiBub2RlLmlkXG4gICAgICAgIH0sXG4gICAgICAgIG9uQmVmb3JlTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICB0aGlzLnRyYWNrQmVmb3JlKFwiYWRkZWRcIiwgZWwpXG4gICAgICAgICAgcmV0dXJuIGVsXG4gICAgICAgIH0sXG4gICAgICAgIG9uTm9kZUFkZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICAvLyBoYWNrIHRvIGZpeCBTYWZhcmkgaGFuZGxpbmcgb2YgaW1nIHNyY3NldCBhbmQgdmlkZW8gdGFnc1xuICAgICAgICAgIGlmKGVsIGluc3RhbmNlb2YgSFRNTEltYWdlRWxlbWVudCAmJiBlbC5zcmNzZXQpe1xuICAgICAgICAgICAgZWwuc3Jjc2V0ID0gZWwuc3Jjc2V0XG4gICAgICAgICAgfSBlbHNlIGlmKGVsIGluc3RhbmNlb2YgSFRNTFZpZGVvRWxlbWVudCAmJiBlbC5hdXRvcGxheSl7XG4gICAgICAgICAgICBlbC5wbGF5KClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoRE9NLmlzTm93VHJpZ2dlckZvcm1FeHRlcm5hbChlbCwgcGh4VHJpZ2dlckV4dGVybmFsKSl7XG4gICAgICAgICAgICBleHRlcm5hbEZvcm1UcmlnZ2VyZWQgPSBlbFxuICAgICAgICAgIH1cbiAgICAgICAgICAvL2lucHV0IGhhbmRsaW5nXG4gICAgICAgICAgRE9NLmRpc2NhcmRFcnJvcih0YXJnZXRDb250YWluZXIsIGVsLCBwaHhGZWVkYmFja0ZvcilcbiAgICAgICAgICAvLyBuZXN0ZWQgdmlldyBoYW5kbGluZ1xuICAgICAgICAgIGlmKChET00uaXNQaHhDaGlsZChlbCkgJiYgdmlldy5vd25zRWxlbWVudChlbCkpIHx8IERPTS5pc1BoeFN0aWNreShlbCkgJiYgdmlldy5vd25zRWxlbWVudChlbC5wYXJlbnROb2RlKSl7XG4gICAgICAgICAgICB0aGlzLnRyYWNrQWZ0ZXIoXCJwaHhDaGlsZEFkZGVkXCIsIGVsKVxuICAgICAgICAgIH1cbiAgICAgICAgICBhZGRlZC5wdXNoKGVsKVxuICAgICAgICB9LFxuICAgICAgICBvbk5vZGVEaXNjYXJkZWQ6IChlbCkgPT4ge1xuICAgICAgICAgIC8vIG5lc3RlZCB2aWV3IGhhbmRsaW5nXG4gICAgICAgICAgaWYoRE9NLmlzUGh4Q2hpbGQoZWwpIHx8IERPTS5pc1BoeFN0aWNreShlbCkpeyBsaXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChlbCkgfVxuICAgICAgICAgIHRoaXMudHJhY2tBZnRlcihcImRpc2NhcmRlZFwiLCBlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVOb2RlRGlzY2FyZGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihlbC5nZXRBdHRyaWJ1dGUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9QUlVORSkgIT09IG51bGwpeyByZXR1cm4gdHJ1ZSB9XG4gICAgICAgICAgaWYoZWwucGFyZW50Tm9kZSAhPT0gbnVsbCAmJiBET00uaXNQaHhVcGRhdGUoZWwucGFyZW50Tm9kZSwgcGh4VXBkYXRlLCBbXCJhcHBlbmRcIiwgXCJwcmVwZW5kXCJdKSAmJiBlbC5pZCl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYoZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShwaHhSZW1vdmUpKXtcbiAgICAgICAgICAgIHBlbmRpbmdSZW1vdmVzLnB1c2goZWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYodGhpcy5za2lwQ0lEU2libGluZyhlbCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0sXG4gICAgICAgIG9uRWxVcGRhdGVkOiAoZWwpID0+IHtcbiAgICAgICAgICBpZihET00uaXNOb3dUcmlnZ2VyRm9ybUV4dGVybmFsKGVsLCBwaHhUcmlnZ2VyRXh0ZXJuYWwpKXtcbiAgICAgICAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZCA9IGVsXG4gICAgICAgICAgfVxuICAgICAgICAgIHVwZGF0ZXMucHVzaChlbClcbiAgICAgICAgfSxcbiAgICAgICAgb25CZWZvcmVFbFVwZGF0ZWQ6IChmcm9tRWwsIHRvRWwpID0+IHtcbiAgICAgICAgICBET00uY2xlYW5DaGlsZE5vZGVzKHRvRWwsIHBoeFVwZGF0ZSlcbiAgICAgICAgICBpZih0aGlzLnNraXBDSURTaWJsaW5nKHRvRWwpKXsgcmV0dXJuIGZhbHNlIH1cbiAgICAgICAgICBpZihET00uaXNQaHhTdGlja3koZnJvbUVsKSl7IHJldHVybiBmYWxzZSB9XG4gICAgICAgICAgaWYoRE9NLmlzSWdub3JlZChmcm9tRWwsIHBoeFVwZGF0ZSkpe1xuICAgICAgICAgICAgdGhpcy50cmFja0JlZm9yZShcInVwZGF0ZWRcIiwgZnJvbUVsLCB0b0VsKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7aXNJZ25vcmVkOiB0cnVlfSlcbiAgICAgICAgICAgIHVwZGF0ZXMucHVzaChmcm9tRWwpXG4gICAgICAgICAgICBET00uYXBwbHlTdGlja3lPcGVyYXRpb25zKGZyb21FbClcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZihmcm9tRWwudHlwZSA9PT0gXCJudW1iZXJcIiAmJiAoZnJvbUVsLnZhbGlkaXR5ICYmIGZyb21FbC52YWxpZGl0eS5iYWRJbnB1dCkpeyByZXR1cm4gZmFsc2UgfVxuICAgICAgICAgIGlmKCFET00uc3luY1BlbmRpbmdSZWYoZnJvbUVsLCB0b0VsLCBkaXNhYmxlV2l0aCkpe1xuICAgICAgICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoZnJvbUVsKSl7XG4gICAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgICAgdXBkYXRlcy5wdXNoKGZyb21FbClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnMoZnJvbUVsKVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gbmVzdGVkIHZpZXcgaGFuZGxpbmdcbiAgICAgICAgICBpZihET00uaXNQaHhDaGlsZCh0b0VsKSl7XG4gICAgICAgICAgICBsZXQgcHJldlNlc3Npb24gPSBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TRVNTSU9OKVxuICAgICAgICAgICAgRE9NLm1lcmdlQXR0cnMoZnJvbUVsLCB0b0VsLCB7ZXhjbHVkZTogW1BIWF9TVEFUSUNdfSlcbiAgICAgICAgICAgIGlmKHByZXZTZXNzaW9uICE9PSBcIlwiKXsgZnJvbUVsLnNldEF0dHJpYnV0ZShQSFhfU0VTU0lPTiwgcHJldlNlc3Npb24pIH1cbiAgICAgICAgICAgIGZyb21FbC5zZXRBdHRyaWJ1dGUoUEhYX1JPT1RfSUQsIHRoaXMucm9vdElEKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBpbnB1dCBoYW5kbGluZ1xuICAgICAgICAgIERPTS5jb3B5UHJpdmF0ZXModG9FbCwgZnJvbUVsKVxuICAgICAgICAgIERPTS5kaXNjYXJkRXJyb3IodGFyZ2V0Q29udGFpbmVyLCB0b0VsLCBwaHhGZWVkYmFja0ZvcilcblxuICAgICAgICAgIGxldCBpc0ZvY3VzZWRGb3JtRWwgPSBmb2N1c2VkICYmIGZyb21FbC5pc1NhbWVOb2RlKGZvY3VzZWQpICYmIERPTS5pc0Zvcm1JbnB1dChmcm9tRWwpXG4gICAgICAgICAgaWYoaXNGb2N1c2VkRm9ybUVsKXtcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIERPTS5tZXJnZUZvY3VzZWRJbnB1dChmcm9tRWwsIHRvRWwpXG4gICAgICAgICAgICBET00uc3luY0F0dHJzVG9Qcm9wcyhmcm9tRWwpXG4gICAgICAgICAgICB1cGRhdGVzLnB1c2goZnJvbUVsKVxuICAgICAgICAgICAgRE9NLmFwcGx5U3RpY2t5T3BlcmF0aW9ucyhmcm9tRWwpXG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYoRE9NLmlzUGh4VXBkYXRlKHRvRWwsIHBoeFVwZGF0ZSwgW1wiYXBwZW5kXCIsIFwicHJlcGVuZFwiXSkpe1xuICAgICAgICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5wdXNoKG5ldyBET01Qb3N0TW9ycGhSZXN0b3Jlcihmcm9tRWwsIHRvRWwsIHRvRWwuZ2V0QXR0cmlidXRlKHBoeFVwZGF0ZSkpKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgRE9NLnN5bmNBdHRyc1RvUHJvcHModG9FbClcbiAgICAgICAgICAgIERPTS5hcHBseVN0aWNreU9wZXJhdGlvbnModG9FbClcbiAgICAgICAgICAgIHRoaXMudHJhY2tCZWZvcmUoXCJ1cGRhdGVkXCIsIGZyb21FbCwgdG9FbClcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpZihsaXZlU29ja2V0LmlzRGVidWdFbmFibGVkKCkpeyBkZXRlY3REdXBsaWNhdGVJZHMoKSB9XG5cbiAgICBpZihhcHBlbmRQcmVwZW5kVXBkYXRlcy5sZW5ndGggPiAwKXtcbiAgICAgIGxpdmVTb2NrZXQudGltZShcInBvc3QtbW9ycGggYXBwZW5kL3ByZXBlbmQgcmVzdG9yYXRpb25cIiwgKCkgPT4ge1xuICAgICAgICBhcHBlbmRQcmVwZW5kVXBkYXRlcy5mb3JFYWNoKHVwZGF0ZSA9PiB1cGRhdGUucGVyZm9ybSgpKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBsaXZlU29ja2V0LnNpbGVuY2VFdmVudHMoKCkgPT4gRE9NLnJlc3RvcmVGb2N1cyhmb2N1c2VkLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKSlcbiAgICBET00uZGlzcGF0Y2hFdmVudChkb2N1bWVudCwgXCJwaHg6dXBkYXRlXCIpXG4gICAgYWRkZWQuZm9yRWFjaChlbCA9PiB0aGlzLnRyYWNrQWZ0ZXIoXCJhZGRlZFwiLCBlbCkpXG4gICAgdXBkYXRlcy5mb3JFYWNoKGVsID0+IHRoaXMudHJhY2tBZnRlcihcInVwZGF0ZWRcIiwgZWwpKVxuXG4gICAgaWYocGVuZGluZ1JlbW92ZXMubGVuZ3RoID4gMCl7XG4gICAgICBsaXZlU29ja2V0LnRyYW5zaXRpb25SZW1vdmVzKHBlbmRpbmdSZW1vdmVzKVxuICAgICAgbGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgcGVuZGluZ1JlbW92ZXMuZm9yRWFjaChlbCA9PiB7XG4gICAgICAgICAgbGV0IGNoaWxkID0gRE9NLmZpcnN0UGh4Q2hpbGQoZWwpXG4gICAgICAgICAgaWYoY2hpbGQpeyBsaXZlU29ja2V0LmRlc3Ryb3lWaWV3QnlFbChjaGlsZCkgfVxuICAgICAgICAgIGVsLnJlbW92ZSgpXG4gICAgICAgIH0pXG4gICAgICAgIHRoaXMudHJhY2tBZnRlcihcInRyYW5zaXRpb25zRGlzY2FyZGVkXCIsIHBlbmRpbmdSZW1vdmVzKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBpZihleHRlcm5hbEZvcm1UcmlnZ2VyZWQpe1xuICAgICAgbGl2ZVNvY2tldC5kaXNjb25uZWN0KClcbiAgICAgIGV4dGVybmFsRm9ybVRyaWdnZXJlZC5zdWJtaXQoKVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZVxuICB9XG5cbiAgaXNDSURQYXRjaCgpeyByZXR1cm4gdGhpcy5jaWRQYXRjaCB9XG5cbiAgc2tpcENJRFNpYmxpbmcoZWwpe1xuICAgIHJldHVybiBlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUgJiYgZWwuZ2V0QXR0cmlidXRlKFBIWF9TS0lQKSAhPT0gbnVsbFxuICB9XG5cbiAgdGFyZ2V0Q0lEQ29udGFpbmVyKGh0bWwpe1xuICAgIGlmKCF0aGlzLmlzQ0lEUGF0Y2goKSl7IHJldHVybiB9XG4gICAgbGV0IFtmaXJzdCwgLi4ucmVzdF0gPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuY29udGFpbmVyLCB0aGlzLnRhcmdldENJRClcbiAgICBpZihyZXN0Lmxlbmd0aCA9PT0gMCAmJiBET00uY2hpbGROb2RlTGVuZ3RoKGh0bWwpID09PSAxKXtcbiAgICAgIHJldHVybiBmaXJzdFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmlyc3QgJiYgZmlyc3QucGFyZW50Tm9kZVxuICAgIH1cbiAgfVxuXG4gIC8vIGJ1aWxkcyBIVE1MIGZvciBtb3JwaGRvbSBwYXRjaFxuICAvLyAtIGZvciBmdWxsIHBhdGNoZXMgb2YgTGl2ZVZpZXcgb3IgYSBjb21wb25lbnQgd2l0aCBhIHNpbmdsZVxuICAvLyAgIHJvb3Qgbm9kZSwgc2ltcGx5IHJldHVybnMgdGhlIEhUTUxcbiAgLy8gLSBmb3IgcGF0Y2hlcyBvZiBhIGNvbXBvbmVudCB3aXRoIG11bHRpcGxlIHJvb3Qgbm9kZXMsIHRoZVxuICAvLyAgIHBhcmVudCBub2RlIGJlY29tZXMgdGhlIHRhcmdldCBjb250YWluZXIgYW5kIG5vbi1jb21wb25lbnRcbiAgLy8gICBzaWJsaW5ncyBhcmUgbWFya2VkIGFzIHNraXAuXG4gIGJ1aWxkRGlmZkhUTUwoY29udGFpbmVyLCBodG1sLCBwaHhVcGRhdGUsIHRhcmdldENvbnRhaW5lcil7XG4gICAgbGV0IGlzQ0lEUGF0Y2ggPSB0aGlzLmlzQ0lEUGF0Y2goKVxuICAgIGxldCBpc0NJRFdpdGhTaW5nbGVSb290ID0gaXNDSURQYXRjaCAmJiB0YXJnZXRDb250YWluZXIuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpID09PSB0aGlzLnRhcmdldENJRC50b1N0cmluZygpXG4gICAgaWYoIWlzQ0lEUGF0Y2ggfHwgaXNDSURXaXRoU2luZ2xlUm9vdCl7XG4gICAgICByZXR1cm4gaHRtbFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjb21wb25lbnQgcGF0Y2ggd2l0aCBtdWx0aXBsZSBDSUQgcm9vdHNcbiAgICAgIGxldCBkaWZmQ29udGFpbmVyID0gbnVsbFxuICAgICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgICBkaWZmQ29udGFpbmVyID0gRE9NLmNsb25lTm9kZSh0YXJnZXRDb250YWluZXIpXG4gICAgICBsZXQgW2ZpcnN0Q29tcG9uZW50LCAuLi5yZXN0XSA9IERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QoZGlmZkNvbnRhaW5lciwgdGhpcy50YXJnZXRDSUQpXG4gICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG4gICAgICByZXN0LmZvckVhY2goZWwgPT4gZWwucmVtb3ZlKCkpXG4gICAgICBBcnJheS5mcm9tKGRpZmZDb250YWluZXIuY2hpbGROb2RlcykuZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgIC8vIHdlIGNhbiBvbmx5IHNraXAgdHJhY2thYmxlIG5vZGVzIHdpdGggYW4gSURcbiAgICAgICAgaWYoY2hpbGQuaWQgJiYgY2hpbGQubm9kZVR5cGUgPT09IE5vZGUuRUxFTUVOVF9OT0RFICYmIGNoaWxkLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKSAhPT0gdGhpcy50YXJnZXRDSUQudG9TdHJpbmcoKSl7XG4gICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9TS0lQLCBcIlwiKVxuICAgICAgICAgIGNoaWxkLmlubmVySFRNTCA9IFwiXCJcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIEFycmF5LmZyb20odGVtcGxhdGUuY29udGVudC5jaGlsZE5vZGVzKS5mb3JFYWNoKGVsID0+IGRpZmZDb250YWluZXIuaW5zZXJ0QmVmb3JlKGVsLCBmaXJzdENvbXBvbmVudCkpXG4gICAgICBmaXJzdENvbXBvbmVudC5yZW1vdmUoKVxuICAgICAgcmV0dXJuIGRpZmZDb250YWluZXIub3V0ZXJIVE1MXG4gICAgfVxuICB9XG59XG4iLCAiaW1wb3J0IHtcbiAgQ09NUE9ORU5UUyxcbiAgRFlOQU1JQ1MsXG4gIFRFTVBMQVRFUyxcbiAgRVZFTlRTLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfU0tJUCxcbiAgUkVQTFksXG4gIFNUQVRJQyxcbiAgVElUTEVcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgaXNPYmplY3QsXG4gIGxvZ0Vycm9yLFxuICBpc0NpZCxcbn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJlZCB7XG4gIHN0YXRpYyBleHRyYWN0KGRpZmYpe1xuICAgIGxldCB7W1JFUExZXTogcmVwbHksIFtFVkVOVFNdOiBldmVudHMsIFtUSVRMRV06IHRpdGxlfSA9IGRpZmZcbiAgICBkZWxldGUgZGlmZltSRVBMWV1cbiAgICBkZWxldGUgZGlmZltFVkVOVFNdXG4gICAgZGVsZXRlIGRpZmZbVElUTEVdXG4gICAgcmV0dXJuIHtkaWZmLCB0aXRsZSwgcmVwbHk6IHJlcGx5IHx8IG51bGwsIGV2ZW50czogZXZlbnRzIHx8IFtdfVxuICB9XG5cbiAgY29uc3RydWN0b3Iodmlld0lkLCByZW5kZXJlZCl7XG4gICAgdGhpcy52aWV3SWQgPSB2aWV3SWRcbiAgICB0aGlzLnJlbmRlcmVkID0ge31cbiAgICB0aGlzLm1lcmdlRGlmZihyZW5kZXJlZClcbiAgfVxuXG4gIHBhcmVudFZpZXdJZCgpeyByZXR1cm4gdGhpcy52aWV3SWQgfVxuXG4gIHRvU3RyaW5nKG9ubHlDaWRzKXtcbiAgICByZXR1cm4gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyh0aGlzLnJlbmRlcmVkLCB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdLCBvbmx5Q2lkcylcbiAgfVxuXG4gIHJlY3Vyc2l2ZVRvU3RyaW5nKHJlbmRlcmVkLCBjb21wb25lbnRzID0gcmVuZGVyZWRbQ09NUE9ORU5UU10sIG9ubHlDaWRzKXtcbiAgICBvbmx5Q2lkcyA9IG9ubHlDaWRzID8gbmV3IFNldChvbmx5Q2lkcykgOiBudWxsXG4gICAgbGV0IG91dHB1dCA9IHtidWZmZXI6IFwiXCIsIGNvbXBvbmVudHM6IGNvbXBvbmVudHMsIG9ubHlDaWRzOiBvbmx5Q2lkc31cbiAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCBudWxsLCBvdXRwdXQpXG4gICAgcmV0dXJuIG91dHB1dC5idWZmZXJcbiAgfVxuXG4gIGNvbXBvbmVudENJRHMoZGlmZil7IHJldHVybiBPYmplY3Qua2V5cyhkaWZmW0NPTVBPTkVOVFNdIHx8IHt9KS5tYXAoaSA9PiBwYXJzZUludChpKSkgfVxuXG4gIGlzQ29tcG9uZW50T25seURpZmYoZGlmZil7XG4gICAgaWYoIWRpZmZbQ09NUE9ORU5UU10peyByZXR1cm4gZmFsc2UgfVxuICAgIHJldHVybiBPYmplY3Qua2V5cyhkaWZmKS5sZW5ndGggPT09IDFcbiAgfVxuXG4gIGdldENvbXBvbmVudChkaWZmLCBjaWQpeyByZXR1cm4gZGlmZltDT01QT05FTlRTXVtjaWRdIH1cblxuICBtZXJnZURpZmYoZGlmZil7XG4gICAgbGV0IG5ld2MgPSBkaWZmW0NPTVBPTkVOVFNdXG4gICAgbGV0IGNhY2hlID0ge31cbiAgICBkZWxldGUgZGlmZltDT01QT05FTlRTXVxuICAgIHRoaXMucmVuZGVyZWQgPSB0aGlzLm11dGFibGVNZXJnZSh0aGlzLnJlbmRlcmVkLCBkaWZmKVxuICAgIHRoaXMucmVuZGVyZWRbQ09NUE9ORU5UU10gPSB0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdIHx8IHt9XG5cbiAgICBpZihuZXdjKXtcbiAgICAgIGxldCBvbGRjID0gdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXVxuXG4gICAgICBmb3IobGV0IGNpZCBpbiBuZXdjKXtcbiAgICAgICAgbmV3Y1tjaWRdID0gdGhpcy5jYWNoZWRGaW5kQ29tcG9uZW50KGNpZCwgbmV3Y1tjaWRdLCBvbGRjLCBuZXdjLCBjYWNoZSlcbiAgICAgIH1cblxuICAgICAgZm9yKGxldCBjaWQgaW4gbmV3Yyl7IG9sZGNbY2lkXSA9IG5ld2NbY2lkXSB9XG4gICAgICBkaWZmW0NPTVBPTkVOVFNdID0gbmV3Y1xuICAgIH1cbiAgfVxuXG4gIGNhY2hlZEZpbmRDb21wb25lbnQoY2lkLCBjZGlmZiwgb2xkYywgbmV3YywgY2FjaGUpe1xuICAgIGlmKGNhY2hlW2NpZF0pe1xuICAgICAgcmV0dXJuIGNhY2hlW2NpZF1cbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IG5kaWZmLCBzdGF0LCBzY2lkID0gY2RpZmZbU1RBVElDXVxuXG4gICAgICBpZihpc0NpZChzY2lkKSl7XG4gICAgICAgIGxldCB0ZGlmZlxuXG4gICAgICAgIGlmKHNjaWQgPiAwKXtcbiAgICAgICAgICB0ZGlmZiA9IHRoaXMuY2FjaGVkRmluZENvbXBvbmVudChzY2lkLCBuZXdjW3NjaWRdLCBvbGRjLCBuZXdjLCBjYWNoZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0ZGlmZiA9IG9sZGNbLXNjaWRdXG4gICAgICAgIH1cblxuICAgICAgICBzdGF0ID0gdGRpZmZbU1RBVElDXVxuICAgICAgICBuZGlmZiA9IHRoaXMuY2xvbmVNZXJnZSh0ZGlmZiwgY2RpZmYpXG4gICAgICAgIG5kaWZmW1NUQVRJQ10gPSBzdGF0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBuZGlmZiA9IGNkaWZmW1NUQVRJQ10gIT09IHVuZGVmaW5lZCA/IGNkaWZmIDogdGhpcy5jbG9uZU1lcmdlKG9sZGNbY2lkXSB8fCB7fSwgY2RpZmYpXG4gICAgICB9XG5cbiAgICAgIGNhY2hlW2NpZF0gPSBuZGlmZlxuICAgICAgcmV0dXJuIG5kaWZmXG4gICAgfVxuICB9XG5cbiAgbXV0YWJsZU1lcmdlKHRhcmdldCwgc291cmNlKXtcbiAgICBpZihzb3VyY2VbU1RBVElDXSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiBzb3VyY2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kb011dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSlcbiAgICAgIHJldHVybiB0YXJnZXRcbiAgICB9XG4gIH1cblxuICBkb011dGFibGVNZXJnZSh0YXJnZXQsIHNvdXJjZSl7XG4gICAgZm9yKGxldCBrZXkgaW4gc291cmNlKXtcbiAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XVxuICAgICAgbGV0IHRhcmdldFZhbCA9IHRhcmdldFtrZXldXG4gICAgICBpZihpc09iamVjdCh2YWwpICYmIHZhbFtTVEFUSUNdID09PSB1bmRlZmluZWQgJiYgaXNPYmplY3QodGFyZ2V0VmFsKSl7XG4gICAgICAgIHRoaXMuZG9NdXRhYmxlTWVyZ2UodGFyZ2V0VmFsLCB2YWwpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0YXJnZXRba2V5XSA9IHZhbFxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsb25lTWVyZ2UodGFyZ2V0LCBzb3VyY2Upe1xuICAgIGxldCBtZXJnZWQgPSB7Li4udGFyZ2V0LCAuLi5zb3VyY2V9XG4gICAgZm9yKGxldCBrZXkgaW4gbWVyZ2VkKXtcbiAgICAgIGxldCB2YWwgPSBzb3VyY2Vba2V5XVxuICAgICAgbGV0IHRhcmdldFZhbCA9IHRhcmdldFtrZXldXG4gICAgICBpZihpc09iamVjdCh2YWwpICYmIHZhbFtTVEFUSUNdID09PSB1bmRlZmluZWQgJiYgaXNPYmplY3QodGFyZ2V0VmFsKSl7XG4gICAgICAgIG1lcmdlZFtrZXldID0gdGhpcy5jbG9uZU1lcmdlKHRhcmdldFZhbCwgdmFsKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbWVyZ2VkXG4gIH1cblxuICBjb21wb25lbnRUb1N0cmluZyhjaWQpeyByZXR1cm4gdGhpcy5yZWN1cnNpdmVDSURUb1N0cmluZyh0aGlzLnJlbmRlcmVkW0NPTVBPTkVOVFNdLCBjaWQpIH1cblxuICBwcnVuZUNJRHMoY2lkcyl7XG4gICAgY2lkcy5mb3JFYWNoKGNpZCA9PiBkZWxldGUgdGhpcy5yZW5kZXJlZFtDT01QT05FTlRTXVtjaWRdKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIGdldCgpeyByZXR1cm4gdGhpcy5yZW5kZXJlZCB9XG5cbiAgaXNOZXdGaW5nZXJwcmludChkaWZmID0ge30peyByZXR1cm4gISFkaWZmW1NUQVRJQ10gfVxuXG4gIHRlbXBsYXRlU3RhdGljKHBhcnQsIHRlbXBsYXRlcyl7XG4gICAgaWYodHlwZW9mIChwYXJ0KSA9PT0gXCJudW1iZXJcIikge1xuICAgICAgcmV0dXJuIHRlbXBsYXRlc1twYXJ0XVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFydFxuICAgIH1cbiAgfVxuXG4gIHRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCl7XG4gICAgaWYocmVuZGVyZWRbRFlOQU1JQ1NdKXsgcmV0dXJuIHRoaXMuY29tcHJlaGVuc2lvblRvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCkgfVxuICAgIGxldCB7W1NUQVRJQ106IHN0YXRpY3N9ID0gcmVuZGVyZWRcbiAgICBzdGF0aWNzID0gdGhpcy50ZW1wbGF0ZVN0YXRpYyhzdGF0aWNzLCB0ZW1wbGF0ZXMpXG5cbiAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbMF1cbiAgICBmb3IobGV0IGkgPSAxOyBpIDwgc3RhdGljcy5sZW5ndGg7IGkrKyl7XG4gICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihyZW5kZXJlZFtpIC0gMV0sIHRlbXBsYXRlcywgb3V0cHV0KVxuICAgICAgb3V0cHV0LmJ1ZmZlciArPSBzdGF0aWNzW2ldXG4gICAgfVxuICB9XG5cbiAgY29tcHJlaGVuc2lvblRvQnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dCl7XG4gICAgbGV0IHtbRFlOQU1JQ1NdOiBkeW5hbWljcywgW1NUQVRJQ106IHN0YXRpY3N9ID0gcmVuZGVyZWRcbiAgICBzdGF0aWNzID0gdGhpcy50ZW1wbGF0ZVN0YXRpYyhzdGF0aWNzLCB0ZW1wbGF0ZXMpXG4gICAgbGV0IGNvbXBUZW1wbGF0ZXMgPSB0ZW1wbGF0ZXMgfHwgcmVuZGVyZWRbVEVNUExBVEVTXVxuXG4gICAgZm9yKGxldCBkID0gMDsgZCA8IGR5bmFtaWNzLmxlbmd0aDsgZCsrKXtcbiAgICAgIGxldCBkeW5hbWljID0gZHluYW1pY3NbZF1cbiAgICAgIG91dHB1dC5idWZmZXIgKz0gc3RhdGljc1swXVxuICAgICAgZm9yKGxldCBpID0gMTsgaSA8IHN0YXRpY3MubGVuZ3RoOyBpKyspe1xuICAgICAgICB0aGlzLmR5bmFtaWNUb0J1ZmZlcihkeW5hbWljW2kgLSAxXSwgY29tcFRlbXBsYXRlcywgb3V0cHV0KVxuICAgICAgICBvdXRwdXQuYnVmZmVyICs9IHN0YXRpY3NbaV1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkeW5hbWljVG9CdWZmZXIocmVuZGVyZWQsIHRlbXBsYXRlcywgb3V0cHV0KXtcbiAgICBpZih0eXBlb2YgKHJlbmRlcmVkKSA9PT0gXCJudW1iZXJcIil7XG4gICAgICBvdXRwdXQuYnVmZmVyICs9IHRoaXMucmVjdXJzaXZlQ0lEVG9TdHJpbmcob3V0cHV0LmNvbXBvbmVudHMsIHJlbmRlcmVkLCBvdXRwdXQub25seUNpZHMpXG4gICAgfSBlbHNlIGlmKGlzT2JqZWN0KHJlbmRlcmVkKSl7XG4gICAgICB0aGlzLnRvT3V0cHV0QnVmZmVyKHJlbmRlcmVkLCB0ZW1wbGF0ZXMsIG91dHB1dClcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LmJ1ZmZlciArPSByZW5kZXJlZFxuICAgIH1cbiAgfVxuXG4gIHJlY3Vyc2l2ZUNJRFRvU3RyaW5nKGNvbXBvbmVudHMsIGNpZCwgb25seUNpZHMpe1xuICAgIGxldCBjb21wb25lbnQgPSBjb21wb25lbnRzW2NpZF0gfHwgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3IgQ0lEICR7Y2lkfWAsIGNvbXBvbmVudHMpXG4gICAgbGV0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgdGVtcGxhdGUuaW5uZXJIVE1MID0gdGhpcy5yZWN1cnNpdmVUb1N0cmluZyhjb21wb25lbnQsIGNvbXBvbmVudHMsIG9ubHlDaWRzKVxuICAgIGxldCBjb250YWluZXIgPSB0ZW1wbGF0ZS5jb250ZW50XG4gICAgbGV0IHNraXAgPSBvbmx5Q2lkcyAmJiAhb25seUNpZHMuaGFzKGNpZClcblxuICAgIGxldCBbaGFzQ2hpbGROb2RlcywgaGFzQ2hpbGRDb21wb25lbnRzXSA9XG4gICAgICBBcnJheS5mcm9tKGNvbnRhaW5lci5jaGlsZE5vZGVzKS5yZWR1Y2UoKFtoYXNOb2RlcywgaGFzQ29tcG9uZW50c10sIGNoaWxkLCBpKSA9PiB7XG4gICAgICAgIGlmKGNoaWxkLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERSl7XG4gICAgICAgICAgaWYoY2hpbGQuZ2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQpKXtcbiAgICAgICAgICAgIHJldHVybiBbaGFzTm9kZXMsIHRydWVdXG4gICAgICAgICAgfVxuICAgICAgICAgIGNoaWxkLnNldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5ULCBjaWQpXG4gICAgICAgICAgaWYoIWNoaWxkLmlkKXsgY2hpbGQuaWQgPSBgJHt0aGlzLnBhcmVudFZpZXdJZCgpfS0ke2NpZH0tJHtpfWAgfVxuICAgICAgICAgIGlmKHNraXApe1xuICAgICAgICAgICAgY2hpbGQuc2V0QXR0cmlidXRlKFBIWF9TS0lQLCBcIlwiKVxuICAgICAgICAgICAgY2hpbGQuaW5uZXJIVE1MID0gXCJcIlxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gW3RydWUsIGhhc0NvbXBvbmVudHNdXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYoY2hpbGQubm9kZVZhbHVlLnRyaW0oKSAhPT0gXCJcIil7XG4gICAgICAgICAgICBsb2dFcnJvcihcIm9ubHkgSFRNTCBlbGVtZW50IHRhZ3MgYXJlIGFsbG93ZWQgYXQgdGhlIHJvb3Qgb2YgY29tcG9uZW50cy5cXG5cXG5cIiArXG4gICAgICAgICAgICAgIGBnb3Q6IFwiJHtjaGlsZC5ub2RlVmFsdWUudHJpbSgpfVwiXFxuXFxuYCArXG4gICAgICAgICAgICAgIFwid2l0aGluOlxcblwiLCB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKVxuICAgICAgICAgICAgY2hpbGQucmVwbGFjZVdpdGgodGhpcy5jcmVhdGVTcGFuKGNoaWxkLm5vZGVWYWx1ZSwgY2lkKSlcbiAgICAgICAgICAgIHJldHVybiBbdHJ1ZSwgaGFzQ29tcG9uZW50c11cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2hpbGQucmVtb3ZlKClcbiAgICAgICAgICAgIHJldHVybiBbaGFzTm9kZXMsIGhhc0NvbXBvbmVudHNdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LCBbZmFsc2UsIGZhbHNlXSlcblxuICAgIGlmKCFoYXNDaGlsZE5vZGVzICYmICFoYXNDaGlsZENvbXBvbmVudHMpe1xuICAgICAgbG9nRXJyb3IoXCJleHBlY3RlZCBhdCBsZWFzdCBvbmUgSFRNTCBlbGVtZW50IHRhZyBpbnNpZGUgYSBjb21wb25lbnQsIGJ1dCB0aGUgY29tcG9uZW50IGlzIGVtcHR5OlxcblwiLFxuICAgICAgICB0ZW1wbGF0ZS5pbm5lckhUTUwudHJpbSgpKVxuICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU3BhbihcIlwiLCBjaWQpLm91dGVySFRNTFxuICAgIH0gZWxzZSBpZighaGFzQ2hpbGROb2RlcyAmJiBoYXNDaGlsZENvbXBvbmVudHMpe1xuICAgICAgbG9nRXJyb3IoXCJleHBlY3RlZCBhdCBsZWFzdCBvbmUgSFRNTCBlbGVtZW50IHRhZyBkaXJlY3RseSBpbnNpZGUgYSBjb21wb25lbnQsIGJ1dCBvbmx5IHN1YmNvbXBvbmVudHMgd2VyZSBmb3VuZC4gQSBjb21wb25lbnQgbXVzdCByZW5kZXIgYXQgbGVhc3Qgb25lIEhUTUwgdGFnIGRpcmVjdGx5IGluc2lkZSBpdHNlbGYuXCIsXG4gICAgICAgIHRlbXBsYXRlLmlubmVySFRNTC50cmltKCkpXG4gICAgICByZXR1cm4gdGVtcGxhdGUuaW5uZXJIVE1MXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZW1wbGF0ZS5pbm5lckhUTUxcbiAgICB9XG4gIH1cblxuICBjcmVhdGVTcGFuKHRleHQsIGNpZCl7XG4gICAgbGV0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKVxuICAgIHNwYW4uaW5uZXJUZXh0ID0gdGV4dFxuICAgIHNwYW4uc2V0QXR0cmlidXRlKFBIWF9DT01QT05FTlQsIGNpZClcbiAgICByZXR1cm4gc3BhblxuICB9XG59XG4iLCAibGV0IHZpZXdIb29rSUQgPSAxXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3SG9vayB7XG4gIHN0YXRpYyBtYWtlSUQoKXsgcmV0dXJuIHZpZXdIb29rSUQrKyB9XG4gIHN0YXRpYyBlbGVtZW50SUQoZWwpeyByZXR1cm4gZWwucGh4SG9va0lkIH1cblxuICBjb25zdHJ1Y3Rvcih2aWV3LCBlbCwgY2FsbGJhY2tzKXtcbiAgICB0aGlzLl9fdmlldyA9IHZpZXdcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSB2aWV3LmxpdmVTb2NrZXRcbiAgICB0aGlzLl9fY2FsbGJhY2tzID0gY2FsbGJhY2tzXG4gICAgdGhpcy5fX2xpc3RlbmVycyA9IG5ldyBTZXQoKVxuICAgIHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCA9IGZhbHNlXG4gICAgdGhpcy5lbCA9IGVsXG4gICAgdGhpcy5lbC5waHhIb29rSWQgPSB0aGlzLmNvbnN0cnVjdG9yLm1ha2VJRCgpXG4gICAgZm9yKGxldCBrZXkgaW4gdGhpcy5fX2NhbGxiYWNrcyl7IHRoaXNba2V5XSA9IHRoaXMuX19jYWxsYmFja3Nba2V5XSB9XG4gIH1cblxuICBfX21vdW50ZWQoKXsgdGhpcy5tb3VudGVkICYmIHRoaXMubW91bnRlZCgpIH1cbiAgX191cGRhdGVkKCl7IHRoaXMudXBkYXRlZCAmJiB0aGlzLnVwZGF0ZWQoKSB9XG4gIF9fYmVmb3JlVXBkYXRlKCl7IHRoaXMuYmVmb3JlVXBkYXRlICYmIHRoaXMuYmVmb3JlVXBkYXRlKCkgfVxuICBfX2Rlc3Ryb3llZCgpeyB0aGlzLmRlc3Ryb3llZCAmJiB0aGlzLmRlc3Ryb3llZCgpIH1cbiAgX19yZWNvbm5lY3RlZCgpe1xuICAgIGlmKHRoaXMuX19pc0Rpc2Nvbm5lY3RlZCl7XG4gICAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSBmYWxzZVxuICAgICAgdGhpcy5yZWNvbm5lY3RlZCAmJiB0aGlzLnJlY29ubmVjdGVkKClcbiAgICB9XG4gIH1cbiAgX19kaXNjb25uZWN0ZWQoKXtcbiAgICB0aGlzLl9faXNEaXNjb25uZWN0ZWQgPSB0cnVlXG4gICAgdGhpcy5kaXNjb25uZWN0ZWQgJiYgdGhpcy5kaXNjb25uZWN0ZWQoKVxuICB9XG5cbiAgcHVzaEV2ZW50KGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LnB1c2hIb29rRXZlbnQobnVsbCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gIH1cblxuICBwdXNoRXZlbnRUbyhwaHhUYXJnZXQsIGV2ZW50LCBwYXlsb2FkID0ge30sIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LndpdGhpblRhcmdldHMocGh4VGFyZ2V0LCAodmlldywgdGFyZ2V0Q3R4KSA9PiB7XG4gICAgICByZXR1cm4gdmlldy5wdXNoSG9va0V2ZW50KHRhcmdldEN0eCwgZXZlbnQsIHBheWxvYWQsIG9uUmVwbHkpXG4gICAgfSlcbiAgfVxuXG4gIGhhbmRsZUV2ZW50KGV2ZW50LCBjYWxsYmFjayl7XG4gICAgbGV0IGNhbGxiYWNrUmVmID0gKGN1c3RvbUV2ZW50LCBieXBhc3MpID0+IGJ5cGFzcyA/IGV2ZW50IDogY2FsbGJhY2soY3VzdG9tRXZlbnQuZGV0YWlsKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmFkZChjYWxsYmFja1JlZilcbiAgICByZXR1cm4gY2FsbGJhY2tSZWZcbiAgfVxuXG4gIHJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKXtcbiAgICBsZXQgZXZlbnQgPSBjYWxsYmFja1JlZihudWxsLCB0cnVlKVxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGBwaHg6JHtldmVudH1gLCBjYWxsYmFja1JlZilcbiAgICB0aGlzLl9fbGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFja1JlZilcbiAgfVxuXG4gIHVwbG9hZChuYW1lLCBmaWxlcyl7XG4gICAgcmV0dXJuIHRoaXMuX192aWV3LmRpc3BhdGNoVXBsb2FkcyhuYW1lLCBmaWxlcylcbiAgfVxuXG4gIHVwbG9hZFRvKHBoeFRhcmdldCwgbmFtZSwgZmlsZXMpe1xuICAgIHJldHVybiB0aGlzLl9fdmlldy53aXRoaW5UYXJnZXRzKHBoeFRhcmdldCwgdmlldyA9PiB2aWV3LmRpc3BhdGNoVXBsb2FkcyhuYW1lLCBmaWxlcykpXG4gIH1cblxuICBfX2NsZWFudXBfXygpe1xuICAgIHRoaXMuX19saXN0ZW5lcnMuZm9yRWFjaChjYWxsYmFja1JlZiA9PiB0aGlzLnJlbW92ZUhhbmRsZUV2ZW50KGNhbGxiYWNrUmVmKSlcbiAgfVxufVxuIiwgImltcG9ydCBET00gZnJvbSBcIi4vZG9tXCJcblxubGV0IEpTID0ge1xuICBleGVjKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBkZWZhdWx0cyl7XG4gICAgbGV0IFtkZWZhdWx0S2luZCwgZGVmYXVsdEFyZ3NdID0gZGVmYXVsdHMgfHwgW251bGwsIHt9XVxuICAgIGxldCBjb21tYW5kcyA9IHBoeEV2ZW50LmNoYXJBdCgwKSA9PT0gXCJbXCIgP1xuICAgICAgSlNPTi5wYXJzZShwaHhFdmVudCkgOiBbW2RlZmF1bHRLaW5kLCBkZWZhdWx0QXJnc11dXG5cbiAgICBjb21tYW5kcy5mb3JFYWNoKChba2luZCwgYXJnc10pID0+IHtcbiAgICAgIGlmKGtpbmQgPT09IGRlZmF1bHRLaW5kICYmIGRlZmF1bHRBcmdzLmRhdGEpe1xuICAgICAgICBhcmdzLmRhdGEgPSBPYmplY3QuYXNzaWduKGFyZ3MuZGF0YSB8fCB7fSwgZGVmYXVsdEFyZ3MuZGF0YSlcbiAgICAgIH1cbiAgICAgIHRoaXMuZmlsdGVyVG9FbHMoc291cmNlRWwsIGFyZ3MpLmZvckVhY2goZWwgPT4ge1xuICAgICAgICB0aGlzW2BleGVjXyR7a2luZH1gXShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIGFyZ3MpXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgaXNWaXNpYmxlKGVsKXtcbiAgICByZXR1cm4gISEoZWwub2Zmc2V0V2lkdGggfHwgZWwub2Zmc2V0SGVpZ2h0IHx8IGVsLmdldENsaWVudFJlY3RzKCkubGVuZ3RoID4gMClcbiAgfSxcblxuICAvLyBwcml2YXRlXG5cbiAgLy8gY29tbWFuZHNcblxuICBleGVjX2Rpc3BhdGNoKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge3RvLCBldmVudCwgZGV0YWlsLCBidWJibGVzfSl7XG4gICAgZGV0YWlsID0gZGV0YWlsIHx8IHt9XG4gICAgZGV0YWlsLmRpc3BhdGNoZXIgPSBzb3VyY2VFbFxuICAgIERPTS5kaXNwYXRjaEV2ZW50KGVsLCBldmVudCwge2RldGFpbCwgYnViYmxlc30pXG4gIH0sXG5cbiAgZXhlY19wdXNoKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwgYXJncyl7XG4gICAgaWYoIXZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG5cbiAgICBsZXQge2V2ZW50LCBkYXRhLCB0YXJnZXQsIHBhZ2VfbG9hZGluZywgbG9hZGluZywgdmFsdWUsIGRpc3BhdGNoZXJ9ID0gYXJnc1xuICAgIGxldCBwdXNoT3B0cyA9IHtsb2FkaW5nLCB2YWx1ZSwgdGFyZ2V0LCBwYWdlX2xvYWRpbmc6ICEhcGFnZV9sb2FkaW5nfVxuICAgIGxldCB0YXJnZXRTcmMgPSBldmVudFR5cGUgPT09IFwiY2hhbmdlXCIgJiYgZGlzcGF0Y2hlciA/IGRpc3BhdGNoZXIgOiBzb3VyY2VFbFxuICAgIGxldCBwaHhUYXJnZXQgPSB0YXJnZXQgfHwgdGFyZ2V0U3JjLmdldEF0dHJpYnV0ZSh2aWV3LmJpbmRpbmcoXCJ0YXJnZXRcIikpIHx8IHRhcmdldFNyY1xuICAgIHZpZXcud2l0aGluVGFyZ2V0cyhwaHhUYXJnZXQsICh0YXJnZXRWaWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJjaGFuZ2VcIil7XG4gICAgICAgIGxldCB7bmV3Q2lkLCBfdGFyZ2V0LCBjYWxsYmFja30gPSBhcmdzXG4gICAgICAgIF90YXJnZXQgPSBfdGFyZ2V0IHx8IChzb3VyY2VFbCBpbnN0YW5jZW9mIEhUTUxJbnB1dEVsZW1lbnQgPyBzb3VyY2VFbC5uYW1lIDogdW5kZWZpbmVkKVxuICAgICAgICBpZihfdGFyZ2V0KXsgcHVzaE9wdHMuX3RhcmdldCA9IF90YXJnZXQgfVxuICAgICAgICB0YXJnZXRWaWV3LnB1c2hJbnB1dChzb3VyY2VFbCwgdGFyZ2V0Q3R4LCBuZXdDaWQsIGV2ZW50IHx8IHBoeEV2ZW50LCBwdXNoT3B0cywgY2FsbGJhY2spXG4gICAgICB9IGVsc2UgaWYoZXZlbnRUeXBlID09PSBcInN1Ym1pdFwiKXtcbiAgICAgICAgdGFyZ2V0Vmlldy5zdWJtaXRGb3JtKHNvdXJjZUVsLCB0YXJnZXRDdHgsIGV2ZW50IHx8IHBoeEV2ZW50LCBwdXNoT3B0cylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRhcmdldFZpZXcucHVzaEV2ZW50KGV2ZW50VHlwZSwgc291cmNlRWwsIHRhcmdldEN0eCwgZXZlbnQgfHwgcGh4RXZlbnQsIGRhdGEsIHB1c2hPcHRzKVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgZXhlY19hZGRfY2xhc3MoZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7bmFtZXMsIHRyYW5zaXRpb24sIHRpbWV9KXtcbiAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgbmFtZXMsIFtdLCB0cmFuc2l0aW9uLCB0aW1lLCB2aWV3KVxuICB9LFxuXG4gIGV4ZWNfcmVtb3ZlX2NsYXNzKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge25hbWVzLCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBuYW1lcywgdHJhbnNpdGlvbiwgdGltZSwgdmlldylcbiAgfSxcblxuICBleGVjX3RyYW5zaXRpb24oZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7dGltZSwgdHJhbnNpdGlvbn0pe1xuICAgIGxldCBbdHJhbnNpdGlvbl9zdGFydCwgcnVubmluZywgdHJhbnNpdGlvbl9lbmRdID0gdHJhbnNpdGlvblxuICAgIGxldCBvblN0YXJ0ID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25fc3RhcnQuY29uY2F0KHJ1bm5pbmcpLCBbXSlcbiAgICBsZXQgb25Eb25lID0gKCkgPT4gdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIHRyYW5zaXRpb25fZW5kLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdChydW5uaW5nKSlcbiAgICB2aWV3LnRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKVxuICB9LFxuXG4gIGV4ZWNfdG9nZ2xlKGV2ZW50VHlwZSwgcGh4RXZlbnQsIHZpZXcsIHNvdXJjZUVsLCBlbCwge2Rpc3BsYXksIGlucywgb3V0cywgdGltZX0pe1xuICAgIHRoaXMudG9nZ2xlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIGlucywgb3V0cywgdGltZSlcbiAgfSxcblxuICBleGVjX3Nob3coZXZlbnRUeXBlLCBwaHhFdmVudCwgdmlldywgc291cmNlRWwsIGVsLCB7ZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZX0pe1xuICAgIHRoaXMuc2hvdyhldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lKVxuICB9LFxuXG4gIGV4ZWNfaGlkZShldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHtkaXNwbGF5LCB0cmFuc2l0aW9uLCB0aW1lfSl7XG4gICAgdGhpcy5oaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpXG4gIH0sXG5cbiAgZXhlY19zZXRfYXR0cihldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHthdHRyOiBbYXR0ciwgdmFsXX0pe1xuICAgIHRoaXMuc2V0T3JSZW1vdmVBdHRycyhlbCwgW1thdHRyLCB2YWxdXSwgW10pXG4gIH0sXG5cbiAgZXhlY19yZW1vdmVfYXR0cihldmVudFR5cGUsIHBoeEV2ZW50LCB2aWV3LCBzb3VyY2VFbCwgZWwsIHthdHRyfSl7XG4gICAgdGhpcy5zZXRPclJlbW92ZUF0dHJzKGVsLCBbXSwgW2F0dHJdKVxuICB9LFxuXG4gIC8vIHV0aWxzIGZvciBjb21tYW5kc1xuXG4gIHNob3coZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgdHJhbnNpdGlvbiwgdGltZSl7XG4gICAgaWYoIXRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCB0cmFuc2l0aW9uLCBudWxsLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICBoaWRlKGV2ZW50VHlwZSwgdmlldywgZWwsIGRpc3BsYXksIHRyYW5zaXRpb24sIHRpbWUpe1xuICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICB0aGlzLnRvZ2dsZShldmVudFR5cGUsIHZpZXcsIGVsLCBkaXNwbGF5LCBudWxsLCB0cmFuc2l0aW9uLCB0aW1lKVxuICAgIH1cbiAgfSxcblxuICB0b2dnbGUoZXZlbnRUeXBlLCB2aWV3LCBlbCwgZGlzcGxheSwgaW5zLCBvdXRzLCB0aW1lKXtcbiAgICBsZXQgW2luQ2xhc3NlcywgaW5TdGFydENsYXNzZXMsIGluRW5kQ2xhc3Nlc10gPSBpbnMgfHwgW1tdLCBbXSwgW11dXG4gICAgbGV0IFtvdXRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMsIG91dEVuZENsYXNzZXNdID0gb3V0cyB8fCBbW10sIFtdLCBbXV1cbiAgICBpZihpbkNsYXNzZXMubGVuZ3RoID4gMCB8fCBvdXRDbGFzc2VzLmxlbmd0aCA+IDApe1xuICAgICAgaWYodGhpcy5pc1Zpc2libGUoZWwpKXtcbiAgICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIG91dFN0YXJ0Q2xhc3NlcywgaW5DbGFzc2VzLmNvbmNhdChpblN0YXJ0Q2xhc3NlcykuY29uY2F0KGluRW5kQ2xhc3NlcykpXG4gICAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgb3V0Q2xhc3NlcywgW10pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBvdXRFbmRDbGFzc2VzLCBvdXRTdGFydENsYXNzZXMpKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1zdGFydFwiKSlcbiAgICAgICAgdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmFkZE9yUmVtb3ZlQ2xhc3NlcyhlbCwgW10sIG91dENsYXNzZXMuY29uY2F0KG91dEVuZENsYXNzZXMpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYoZXZlbnRUeXBlID09PSBcInJlbW92ZVwiKXsgcmV0dXJuIH1cbiAgICAgICAgbGV0IG9uU3RhcnQgPSAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluU3RhcnRDbGFzc2VzLCBvdXRDbGFzc2VzLmNvbmNhdChvdXRTdGFydENsYXNzZXMpLmNvbmNhdChvdXRFbmRDbGFzc2VzKSlcbiAgICAgICAgICBET00ucHV0U3RpY2t5KGVsLCBcInRvZ2dsZVwiLCBjdXJyZW50RWwgPT4gY3VycmVudEVsLnN0eWxlLmRpc3BsYXkgPSAoZGlzcGxheSB8fCBcImJsb2NrXCIpKVxuICAgICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIGluQ2xhc3NlcywgW10pXG4gICAgICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBpbkVuZENsYXNzZXMsIGluU3RhcnRDbGFzc2VzKSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctc3RhcnRcIikpXG4gICAgICAgIHZpZXcudHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5hZGRPclJlbW92ZUNsYXNzZXMoZWwsIFtdLCBpbkNsYXNzZXMuY29uY2F0KGluRW5kQ2xhc3NlcykpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6c2hvdy1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKHRoaXMuaXNWaXNpYmxlKGVsKSl7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OmhpZGUtc3RhcnRcIikpXG4gICAgICAgICAgRE9NLnB1dFN0aWNreShlbCwgXCJ0b2dnbGVcIiwgY3VycmVudEVsID0+IGN1cnJlbnRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCIpXG4gICAgICAgICAgZWwuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJwaHg6aGlkZS1lbmRcIikpXG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcInBoeDpzaG93LXN0YXJ0XCIpKVxuICAgICAgICAgIERPTS5wdXRTdGlja3koZWwsIFwidG9nZ2xlXCIsIGN1cnJlbnRFbCA9PiBjdXJyZW50RWwuc3R5bGUuZGlzcGxheSA9IGRpc3BsYXkgfHwgXCJibG9ja1wiKVxuICAgICAgICAgIGVsLmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwicGh4OnNob3ctZW5kXCIpKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH1cbiAgfSxcblxuICBhZGRPclJlbW92ZUNsYXNzZXMoZWwsIGFkZHMsIHJlbW92ZXMsIHRyYW5zaXRpb24sIHRpbWUsIHZpZXcpe1xuICAgIGxldCBbdHJhbnNpdGlvbl9ydW4sIHRyYW5zaXRpb25fc3RhcnQsIHRyYW5zaXRpb25fZW5kXSA9IHRyYW5zaXRpb24gfHwgW1tdLCBbXSwgW11dXG4gICAgaWYodHJhbnNpdGlvbl9ydW4ubGVuZ3RoID4gMCl7XG4gICAgICBsZXQgb25TdGFydCA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCB0cmFuc2l0aW9uX3N0YXJ0LmNvbmNhdCh0cmFuc2l0aW9uX3J1biksIFtdKVxuICAgICAgbGV0IG9uRG9uZSA9ICgpID0+IHRoaXMuYWRkT3JSZW1vdmVDbGFzc2VzKGVsLCBhZGRzLmNvbmNhdCh0cmFuc2l0aW9uX2VuZCksIHJlbW92ZXMuY29uY2F0KHRyYW5zaXRpb25fcnVuKS5jb25jYXQodHJhbnNpdGlvbl9zdGFydCkpXG4gICAgICByZXR1cm4gdmlldy50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgICB9XG4gICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICBsZXQgW3ByZXZBZGRzLCBwcmV2UmVtb3Zlc10gPSBET00uZ2V0U3RpY2t5KGVsLCBcImNsYXNzZXNcIiwgW1tdLCBbXV0pXG4gICAgICBsZXQga2VlcEFkZHMgPSBhZGRzLmZpbHRlcihuYW1lID0+IHByZXZBZGRzLmluZGV4T2YobmFtZSkgPCAwICYmICFlbC5jbGFzc0xpc3QuY29udGFpbnMobmFtZSkpXG4gICAgICBsZXQga2VlcFJlbW92ZXMgPSByZW1vdmVzLmZpbHRlcihuYW1lID0+IHByZXZSZW1vdmVzLmluZGV4T2YobmFtZSkgPCAwICYmIGVsLmNsYXNzTGlzdC5jb250YWlucyhuYW1lKSlcbiAgICAgIGxldCBuZXdBZGRzID0gcHJldkFkZHMuZmlsdGVyKG5hbWUgPT4gcmVtb3Zlcy5pbmRleE9mKG5hbWUpIDwgMCkuY29uY2F0KGtlZXBBZGRzKVxuICAgICAgbGV0IG5ld1JlbW92ZXMgPSBwcmV2UmVtb3Zlcy5maWx0ZXIobmFtZSA9PiBhZGRzLmluZGV4T2YobmFtZSkgPCAwKS5jb25jYXQoa2VlcFJlbW92ZXMpXG5cbiAgICAgIERPTS5wdXRTdGlja3koZWwsIFwiY2xhc3Nlc1wiLCBjdXJyZW50RWwgPT4ge1xuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LnJlbW92ZSguLi5uZXdSZW1vdmVzKVxuICAgICAgICBjdXJyZW50RWwuY2xhc3NMaXN0LmFkZCguLi5uZXdBZGRzKVxuICAgICAgICByZXR1cm4gW25ld0FkZHMsIG5ld1JlbW92ZXNdXG4gICAgICB9KVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0T3JSZW1vdmVBdHRycyhlbCwgc2V0cywgcmVtb3Zlcyl7XG4gICAgbGV0IFtwcmV2U2V0cywgcHJldlJlbW92ZXNdID0gRE9NLmdldFN0aWNreShlbCwgXCJhdHRyc1wiLCBbW10sIFtdXSlcblxuICAgIGxldCBhbHRlcmVkQXR0cnMgPSBzZXRzLm1hcCgoW2F0dHIsIF92YWxdKSA9PiBhdHRyKS5jb25jYXQocmVtb3Zlcyk7XG4gICAgbGV0IG5ld1NldHMgPSBwcmV2U2V0cy5maWx0ZXIoKFthdHRyLCBfdmFsXSkgPT4gIWFsdGVyZWRBdHRycy5pbmNsdWRlcyhhdHRyKSkuY29uY2F0KHNldHMpO1xuICAgIGxldCBuZXdSZW1vdmVzID0gcHJldlJlbW92ZXMuZmlsdGVyKChhdHRyKSA9PiAhYWx0ZXJlZEF0dHJzLmluY2x1ZGVzKGF0dHIpKS5jb25jYXQocmVtb3Zlcyk7XG5cbiAgICBET00ucHV0U3RpY2t5KGVsLCBcImF0dHJzXCIsIGN1cnJlbnRFbCA9PiB7XG4gICAgICBuZXdSZW1vdmVzLmZvckVhY2goYXR0ciA9PiBjdXJyZW50RWwucmVtb3ZlQXR0cmlidXRlKGF0dHIpKVxuICAgICAgbmV3U2V0cy5mb3JFYWNoKChbYXR0ciwgdmFsXSkgPT4gY3VycmVudEVsLnNldEF0dHJpYnV0ZShhdHRyLCB2YWwpKVxuICAgICAgcmV0dXJuIFtuZXdTZXRzLCBuZXdSZW1vdmVzXVxuICAgIH0pXG4gIH0sXG5cbiAgaGFzQWxsQ2xhc3NlcyhlbCwgY2xhc3Nlcyl7IHJldHVybiBjbGFzc2VzLmV2ZXJ5KG5hbWUgPT4gZWwuY2xhc3NMaXN0LmNvbnRhaW5zKG5hbWUpKSB9LFxuXG4gIGlzVG9nZ2xlZE91dChlbCwgb3V0Q2xhc3Nlcyl7XG4gICAgcmV0dXJuICF0aGlzLmlzVmlzaWJsZShlbCkgfHwgdGhpcy5oYXNBbGxDbGFzc2VzKGVsLCBvdXRDbGFzc2VzKVxuICB9LFxuXG4gIGZpbHRlclRvRWxzKHNvdXJjZUVsLCB7dG99KXtcbiAgICByZXR1cm4gdG8gPyBET00uYWxsKGRvY3VtZW50LCB0bykgOiBbc291cmNlRWxdXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgSlNcbiIsICJpbXBvcnQge1xuICBCRUZPUkVfVU5MT0FEX0xPQURFUl9USU1FT1VULFxuICBDSEVDS0FCTEVfSU5QVVRTLFxuICBDT05TRUNVVElWRV9SRUxPQURTLFxuICBQSFhfQVVUT19SRUNPVkVSLFxuICBQSFhfQ09NUE9ORU5ULFxuICBQSFhfQ09OTkVDVEVEX0NMQVNTLFxuICBQSFhfRElTQUJMRV9XSVRILFxuICBQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUsXG4gIFBIWF9ESVNBQkxFRCxcbiAgUEhYX0RJU0NPTk5FQ1RFRF9DTEFTUyxcbiAgUEhYX0VWRU5UX0NMQVNTRVMsXG4gIFBIWF9FUlJPUl9DTEFTUyxcbiAgUEhYX0ZFRURCQUNLX0ZPUixcbiAgUEhYX0hBU19TVUJNSVRURUQsXG4gIFBIWF9IT09LLFxuICBQSFhfUEFHRV9MT0FESU5HLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfUFJPR1JFU1MsXG4gIFBIWF9SRUFET05MWSxcbiAgUEhYX1JFRixcbiAgUEhYX1JFRl9TUkMsXG4gIFBIWF9ST09UX0lELFxuICBQSFhfU0VTU0lPTixcbiAgUEhYX1NUQVRJQyxcbiAgUEhYX1RSQUNLX1NUQVRJQyxcbiAgUEhYX1RSQUNLX1VQTE9BRFMsXG4gIFBIWF9VUERBVEUsXG4gIFBIWF9VUExPQURfUkVGLFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgUFVTSF9USU1FT1VULFxuICBQSFhfTUFJTixcbn0gZnJvbSBcIi4vY29uc3RhbnRzXCJcblxuaW1wb3J0IHtcbiAgY2xvbmUsXG4gIGNsb3Nlc3RQaHhCaW5kaW5nLFxuICBpc0VtcHR5LFxuICBpc0VxdWFsT2JqLFxuICBsb2dFcnJvcixcbiAgbWF5YmUsXG4gIGlzQ2lkLFxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBCcm93c2VyIGZyb20gXCIuL2Jyb3dzZXJcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IERPTVBhdGNoIGZyb20gXCIuL2RvbV9wYXRjaFwiXG5pbXBvcnQgTGl2ZVVwbG9hZGVyIGZyb20gXCIuL2xpdmVfdXBsb2FkZXJcIlxuaW1wb3J0IFJlbmRlcmVkIGZyb20gXCIuL3JlbmRlcmVkXCJcbmltcG9ydCBWaWV3SG9vayBmcm9tIFwiLi92aWV3X2hvb2tcIlxuaW1wb3J0IEpTIGZyb20gXCIuL2pzXCJcblxubGV0IHNlcmlhbGl6ZUZvcm0gPSAoZm9ybSwgbWV0YSwgb25seU5hbWVzID0gW10pID0+IHtcbiAgbGV0IGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKGZvcm0pXG4gIGxldCB0b1JlbW92ZSA9IFtdXG5cbiAgZm9ybURhdGEuZm9yRWFjaCgodmFsLCBrZXksIF9pbmRleCkgPT4ge1xuICAgIGlmKHZhbCBpbnN0YW5jZW9mIEZpbGUpeyB0b1JlbW92ZS5wdXNoKGtleSkgfVxuICB9KVxuXG4gIC8vIENsZWFudXAgYWZ0ZXIgYnVpbGRpbmcgZmlsZURhdGFcbiAgdG9SZW1vdmUuZm9yRWFjaChrZXkgPT4gZm9ybURhdGEuZGVsZXRlKGtleSkpXG5cbiAgbGV0IHBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoKVxuICBmb3IobGV0IFtrZXksIHZhbF0gb2YgZm9ybURhdGEuZW50cmllcygpKXtcbiAgICBpZihvbmx5TmFtZXMubGVuZ3RoID09PSAwIHx8IG9ubHlOYW1lcy5pbmRleE9mKGtleSkgPj0gMCl7XG4gICAgICBwYXJhbXMuYXBwZW5kKGtleSwgdmFsKVxuICAgIH1cbiAgfVxuICBmb3IobGV0IG1ldGFLZXkgaW4gbWV0YSl7IHBhcmFtcy5hcHBlbmQobWV0YUtleSwgbWV0YVttZXRhS2V5XSkgfVxuXG4gIHJldHVybiBwYXJhbXMudG9TdHJpbmcoKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWaWV3IHtcbiAgY29uc3RydWN0b3IoZWwsIGxpdmVTb2NrZXQsIHBhcmVudFZpZXcsIGZsYXNoKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQgPSBsaXZlU29ja2V0XG4gICAgdGhpcy5mbGFzaCA9IGZsYXNoXG4gICAgdGhpcy5wYXJlbnQgPSBwYXJlbnRWaWV3XG4gICAgdGhpcy5yb290ID0gcGFyZW50VmlldyA/IHBhcmVudFZpZXcucm9vdCA6IHRoaXNcbiAgICB0aGlzLmVsID0gZWxcbiAgICB0aGlzLmlkID0gdGhpcy5lbC5pZFxuICAgIHRoaXMucmVmID0gMFxuICAgIHRoaXMuY2hpbGRKb2lucyA9IDBcbiAgICB0aGlzLmxvYWRlclRpbWVyID0gbnVsbFxuICAgIHRoaXMucGVuZGluZ0RpZmZzID0gW11cbiAgICB0aGlzLnBydW5pbmdDSURzID0gW11cbiAgICB0aGlzLnJlZGlyZWN0ID0gZmFsc2VcbiAgICB0aGlzLmhyZWYgPSBudWxsXG4gICAgdGhpcy5qb2luQ291bnQgPSB0aGlzLnBhcmVudCA/IHRoaXMucGFyZW50LmpvaW5Db3VudCAtIDEgOiAwXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IHRydWVcbiAgICB0aGlzLmRlc3Ryb3llZCA9IGZhbHNlXG4gICAgdGhpcy5qb2luQ2FsbGJhY2sgPSBmdW5jdGlvbihvbkRvbmUpeyBvbkRvbmUgJiYgb25Eb25lKCkgfVxuICAgIHRoaXMuc3RvcENhbGxiYWNrID0gZnVuY3Rpb24oKXsgfVxuICAgIHRoaXMucGVuZGluZ0pvaW5PcHMgPSB0aGlzLnBhcmVudCA/IG51bGwgOiBbXVxuICAgIHRoaXMudmlld0hvb2tzID0ge31cbiAgICB0aGlzLnVwbG9hZGVycyA9IHt9XG4gICAgdGhpcy5mb3JtU3VibWl0cyA9IFtdXG4gICAgdGhpcy5jaGlsZHJlbiA9IHRoaXMucGFyZW50ID8gbnVsbCA6IHt9XG4gICAgdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdID0ge31cbiAgICB0aGlzLmNoYW5uZWwgPSB0aGlzLmxpdmVTb2NrZXQuY2hhbm5lbChgbHY6JHt0aGlzLmlkfWAsICgpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHJlZGlyZWN0OiB0aGlzLnJlZGlyZWN0ID8gdGhpcy5ocmVmIDogdW5kZWZpbmVkLFxuICAgICAgICB1cmw6IHRoaXMucmVkaXJlY3QgPyB1bmRlZmluZWQgOiB0aGlzLmhyZWYgfHwgdW5kZWZpbmVkLFxuICAgICAgICBwYXJhbXM6IHRoaXMuY29ubmVjdFBhcmFtcygpLFxuICAgICAgICBzZXNzaW9uOiB0aGlzLmdldFNlc3Npb24oKSxcbiAgICAgICAgc3RhdGljOiB0aGlzLmdldFN0YXRpYygpLFxuICAgICAgICBmbGFzaDogdGhpcy5mbGFzaFxuICAgICAgfVxuICAgIH0pXG4gICAgdGhpcy5zaG93TG9hZGVyKHRoaXMubGl2ZVNvY2tldC5sb2FkZXJUaW1lb3V0KVxuICAgIHRoaXMuYmluZENoYW5uZWwoKVxuICB9XG5cbiAgc2V0SHJlZihocmVmKXsgdGhpcy5ocmVmID0gaHJlZiB9XG5cbiAgc2V0UmVkaXJlY3QoaHJlZil7XG4gICAgdGhpcy5yZWRpcmVjdCA9IHRydWVcbiAgICB0aGlzLmhyZWYgPSBocmVmXG4gIH1cblxuICBpc01haW4oKXsgcmV0dXJuIHRoaXMuZWwuaGFzQXR0cmlidXRlKFBIWF9NQUlOKSB9XG5cbiAgY29ubmVjdFBhcmFtcygpe1xuICAgIGxldCBwYXJhbXMgPSB0aGlzLmxpdmVTb2NrZXQucGFyYW1zKHRoaXMuZWwpXG4gICAgbGV0IG1hbmlmZXN0ID1cbiAgICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX1RSQUNLX1NUQVRJQyl9XWApXG4gICAgICAgIC5tYXAobm9kZSA9PiBub2RlLnNyYyB8fCBub2RlLmhyZWYpLmZpbHRlcih1cmwgPT4gdHlwZW9mICh1cmwpID09PSBcInN0cmluZ1wiKVxuXG4gICAgaWYobWFuaWZlc3QubGVuZ3RoID4gMCl7IHBhcmFtc1tcIl90cmFja19zdGF0aWNcIl0gPSBtYW5pZmVzdCB9XG4gICAgcGFyYW1zW1wiX21vdW50c1wiXSA9IHRoaXMuam9pbkNvdW50XG5cbiAgICByZXR1cm4gcGFyYW1zXG4gIH1cblxuICBpc0Nvbm5lY3RlZCgpeyByZXR1cm4gdGhpcy5jaGFubmVsLmNhblB1c2goKSB9XG5cbiAgZ2V0U2Vzc2lvbigpeyByZXR1cm4gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NFU1NJT04pIH1cblxuICBnZXRTdGF0aWMoKXtcbiAgICBsZXQgdmFsID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoUEhYX1NUQVRJQylcbiAgICByZXR1cm4gdmFsID09PSBcIlwiID8gbnVsbCA6IHZhbFxuICB9XG5cbiAgZGVzdHJveShjYWxsYmFjayA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5kZXN0cm95ZWQgPSB0cnVlXG4gICAgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVxuICAgIGlmKHRoaXMucGFyZW50KXsgZGVsZXRlIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLnBhcmVudC5pZF1bdGhpcy5pZF0gfVxuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIGxldCBvbkZpbmlzaGVkID0gKCkgPT4ge1xuICAgICAgY2FsbGJhY2soKVxuICAgICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7XG4gICAgICAgIHRoaXMuZGVzdHJveUhvb2sodGhpcy52aWV3SG9va3NbaWRdKVxuICAgICAgfVxuICAgIH1cblxuICAgIERPTS5tYXJrUGh4Q2hpbGREZXN0cm95ZWQodGhpcy5lbClcblxuICAgIHRoaXMubG9nKFwiZGVzdHJveWVkXCIsICgpID0+IFtcInRoZSBjaGlsZCBoYXMgYmVlbiByZW1vdmVkIGZyb20gdGhlIHBhcmVudFwiXSlcbiAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgICAgLnJlY2VpdmUoXCJva1wiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCBvbkZpbmlzaGVkKVxuICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsIG9uRmluaXNoZWQpXG4gIH1cblxuICBzZXRDb250YWluZXJDbGFzc2VzKC4uLmNsYXNzZXMpe1xuICAgIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZShcbiAgICAgIFBIWF9DT05ORUNURURfQ0xBU1MsXG4gICAgICBQSFhfRElTQ09OTkVDVEVEX0NMQVNTLFxuICAgICAgUEhYX0VSUk9SX0NMQVNTXG4gICAgKVxuICAgIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzKVxuICB9XG5cbiAgc2hvd0xvYWRlcih0aW1lb3V0KXtcbiAgICBjbGVhclRpbWVvdXQodGhpcy5sb2FkZXJUaW1lcilcbiAgICBpZih0aW1lb3V0KXtcbiAgICAgIHRoaXMubG9hZGVyVGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHRoaXMuc2hvd0xvYWRlcigpLCB0aW1lb3V0KVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IobGV0IGlkIGluIHRoaXMudmlld0hvb2tzKXsgdGhpcy52aWV3SG9va3NbaWRdLl9fZGlzY29ubmVjdGVkKCkgfVxuICAgICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9ESVNDT05ORUNURURfQ0xBU1MpXG4gICAgfVxuICB9XG5cbiAgaGlkZUxvYWRlcigpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvYWRlclRpbWVyKVxuICAgIHRoaXMuc2V0Q29udGFpbmVyQ2xhc3NlcyhQSFhfQ09OTkVDVEVEX0NMQVNTKVxuICB9XG5cbiAgdHJpZ2dlclJlY29ubmVjdGVkKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnZpZXdIb29rcyl7IHRoaXMudmlld0hvb2tzW2lkXS5fX3JlY29ubmVjdGVkKCkgfVxuICB9XG5cbiAgbG9nKGtpbmQsIG1zZ0NhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQubG9nKHRoaXMsIGtpbmQsIG1zZ0NhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMubGl2ZVNvY2tldC50cmFuc2l0aW9uKHRpbWUsIG9uU3RhcnQsIG9uRG9uZSlcbiAgfVxuXG4gIHdpdGhpblRhcmdldHMocGh4VGFyZ2V0LCBjYWxsYmFjayl7XG4gICAgaWYocGh4VGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgfHwgcGh4VGFyZ2V0IGluc3RhbmNlb2YgU1ZHRWxlbWVudCl7XG4gICAgICByZXR1cm4gdGhpcy5saXZlU29ja2V0Lm93bmVyKHBoeFRhcmdldCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCBwaHhUYXJnZXQpKVxuICAgIH1cblxuICAgIGlmKGlzQ2lkKHBoeFRhcmdldCkpe1xuICAgICAgbGV0IHRhcmdldHMgPSBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIHBoeFRhcmdldClcbiAgICAgIGlmKHRhcmdldHMubGVuZ3RoID09PSAwKXtcbiAgICAgICAgbG9nRXJyb3IoYG5vIGNvbXBvbmVudCBmb3VuZCBtYXRjaGluZyBwaHgtdGFyZ2V0IG9mICR7cGh4VGFyZ2V0fWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayh0aGlzLCBwYXJzZUludChwaHhUYXJnZXQpKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgdGFyZ2V0cyA9IEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChwaHhUYXJnZXQpKVxuICAgICAgaWYodGFyZ2V0cy5sZW5ndGggPT09IDApeyBsb2dFcnJvcihgbm90aGluZyBmb3VuZCBtYXRjaGluZyB0aGUgcGh4LXRhcmdldCBzZWxlY3RvciBcIiR7cGh4VGFyZ2V0fVwiYCkgfVxuICAgICAgdGFyZ2V0cy5mb3JFYWNoKHRhcmdldCA9PiB0aGlzLmxpdmVTb2NrZXQub3duZXIodGFyZ2V0LCB2aWV3ID0+IGNhbGxiYWNrKHZpZXcsIHRhcmdldCkpKVxuICAgIH1cbiAgfVxuXG4gIGFwcGx5RGlmZih0eXBlLCByYXdEaWZmLCBjYWxsYmFjayl7XG4gICAgdGhpcy5sb2codHlwZSwgKCkgPT4gW1wiXCIsIGNsb25lKHJhd0RpZmYpXSlcbiAgICBsZXQge2RpZmYsIHJlcGx5LCBldmVudHMsIHRpdGxlfSA9IFJlbmRlcmVkLmV4dHJhY3QocmF3RGlmZilcbiAgICBpZih0aXRsZSl7IERPTS5wdXRUaXRsZSh0aXRsZSkgfVxuXG4gICAgY2FsbGJhY2soe2RpZmYsIHJlcGx5LCBldmVudHN9KVxuICAgIHJldHVybiByZXBseVxuICB9XG5cbiAgb25Kb2luKHJlc3Ape1xuICAgIGxldCB7cmVuZGVyZWQsIGNvbnRhaW5lcn0gPSByZXNwXG4gICAgaWYoY29udGFpbmVyKXtcbiAgICAgIGxldCBbdGFnLCBhdHRyc10gPSBjb250YWluZXJcbiAgICAgIHRoaXMuZWwgPSBET00ucmVwbGFjZVJvb3RDb250YWluZXIodGhpcy5lbCwgdGFnLCBhdHRycylcbiAgICB9XG4gICAgdGhpcy5jaGlsZEpvaW5zID0gMFxuICAgIHRoaXMuam9pblBlbmRpbmcgPSB0cnVlXG4gICAgdGhpcy5mbGFzaCA9IG51bGxcblxuICAgIEJyb3dzZXIuZHJvcExvY2FsKHRoaXMubGl2ZVNvY2tldC5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUylcbiAgICB0aGlzLmFwcGx5RGlmZihcIm1vdW50XCIsIHJlbmRlcmVkLCAoe2RpZmYsIGV2ZW50c30pID0+IHtcbiAgICAgIHRoaXMucmVuZGVyZWQgPSBuZXcgUmVuZGVyZWQodGhpcy5pZCwgZGlmZilcbiAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJDb250YWluZXIobnVsbCwgXCJqb2luXCIpXG4gICAgICB0aGlzLmRyb3BQZW5kaW5nUmVmcygpXG4gICAgICBsZXQgZm9ybXMgPSB0aGlzLmZvcm1zRm9yUmVjb3ZlcnkoaHRtbClcbiAgICAgIHRoaXMuam9pbkNvdW50KytcblxuICAgICAgaWYoZm9ybXMubGVuZ3RoID4gMCl7XG4gICAgICAgIGZvcm1zLmZvckVhY2goKFtmb3JtLCBuZXdGb3JtLCBuZXdDaWRdLCBpKSA9PiB7XG4gICAgICAgICAgdGhpcy5wdXNoRm9ybVJlY292ZXJ5KGZvcm0sIG5ld0NpZCwgcmVzcCA9PiB7XG4gICAgICAgICAgICBpZihpID09PSBmb3Jtcy5sZW5ndGggLSAxKXtcbiAgICAgICAgICAgICAgdGhpcy5vbkpvaW5Db21wbGV0ZShyZXNwLCBodG1sLCBldmVudHMpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25Kb2luQ29tcGxldGUocmVzcCwgaHRtbCwgZXZlbnRzKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBkcm9wUGVuZGluZ1JlZnMoKXtcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7UEhYX1JFRl9TUkN9PVwiJHt0aGlzLmlkfVwiXVske1BIWF9SRUZ9XWAsIGVsID0+IHtcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGKVxuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfU1JDKVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW5Db21wbGV0ZSh7bGl2ZV9wYXRjaH0sIGh0bWwsIGV2ZW50cyl7XG4gICAgLy8gSW4gb3JkZXIgdG8gcHJvdmlkZSBhIGJldHRlciBleHBlcmllbmNlLCB3ZSB3YW50IHRvIGpvaW5cbiAgICAvLyBhbGwgTGl2ZVZpZXdzIGZpcnN0IGFuZCBvbmx5IHRoZW4gYXBwbHkgdGhlaXIgcGF0Y2hlcy5cbiAgICBpZih0aGlzLmpvaW5Db3VudCA+IDEgfHwgKHRoaXMucGFyZW50ICYmICF0aGlzLnBhcmVudC5pc0pvaW5QZW5kaW5nKCkpKXtcbiAgICAgIHJldHVybiB0aGlzLmFwcGx5Sm9pblBhdGNoKGxpdmVfcGF0Y2gsIGh0bWwsIGV2ZW50cylcbiAgICB9XG5cbiAgICAvLyBPbmUgZG93bnNpZGUgb2YgdGhpcyBhcHByb2FjaCBpcyB0aGF0IHdlIG5lZWQgdG8gZmluZCBwaHhDaGlsZHJlblxuICAgIC8vIGluIHRoZSBodG1sIGZyYWdtZW50LCBpbnN0ZWFkIG9mIGRpcmVjdGx5IG9uIHRoZSBET00uIFRoZSBmcmFnbWVudFxuICAgIC8vIGFsc28gZG9lcyBub3QgaW5jbHVkZSBQSFhfU1RBVElDLCBzbyB3ZSBuZWVkIHRvIGNvcHkgaXQgb3ZlciBmcm9tXG4gICAgLy8gdGhlIERPTS5cbiAgICBsZXQgbmV3Q2hpbGRyZW4gPSBET00uZmluZFBoeENoaWxkcmVuSW5GcmFnbWVudChodG1sLCB0aGlzLmlkKS5maWx0ZXIodG9FbCA9PiB7XG4gICAgICBsZXQgZnJvbUVsID0gdG9FbC5pZCAmJiB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoYFtpZD1cIiR7dG9FbC5pZH1cIl1gKVxuICAgICAgbGV0IHBoeFN0YXRpYyA9IGZyb21FbCAmJiBmcm9tRWwuZ2V0QXR0cmlidXRlKFBIWF9TVEFUSUMpXG4gICAgICBpZihwaHhTdGF0aWMpeyB0b0VsLnNldEF0dHJpYnV0ZShQSFhfU1RBVElDLCBwaHhTdGF0aWMpIH1cbiAgICAgIHJldHVybiB0aGlzLmpvaW5DaGlsZCh0b0VsKVxuICAgIH0pXG5cbiAgICBpZihuZXdDaGlsZHJlbi5sZW5ndGggPT09IDApe1xuICAgICAgaWYodGhpcy5wYXJlbnQpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXSlcbiAgICAgICAgdGhpcy5wYXJlbnQuYWNrSm9pbih0aGlzKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vbkFsbENoaWxkSm9pbnNDb21wbGV0ZSgpXG4gICAgICAgIHRoaXMuYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gdGhpcy5hcHBseUpvaW5QYXRjaChsaXZlX3BhdGNoLCBodG1sLCBldmVudHMpXSlcbiAgICB9XG4gIH1cblxuICBhdHRhY2hUcnVlRG9jRWwoKXtcbiAgICB0aGlzLmVsID0gRE9NLmJ5SWQodGhpcy5pZClcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCwgdGhpcy5yb290LmlkKVxuICB9XG5cbiAgYXBwbHlKb2luUGF0Y2gobGl2ZV9wYXRjaCwgaHRtbCwgZXZlbnRzKXtcbiAgICB0aGlzLmF0dGFjaFRydWVEb2NFbCgpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIG51bGwpXG4gICAgcGF0Y2gubWFya1BydW5hYmxlQ29udGVudEZvclJlbW92YWwoKVxuICAgIHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCBmYWxzZSlcbiAgICB0aGlzLmpvaW5OZXdDaGlsZHJlbigpXG4gICAgRE9NLmFsbCh0aGlzLmVsLCBgWyR7dGhpcy5iaW5kaW5nKFBIWF9IT09LKX1dLCBbZGF0YS1waHgtJHtQSFhfSE9PS31dYCwgaG9va0VsID0+IHtcbiAgICAgIGxldCBob29rID0gdGhpcy5hZGRIb29rKGhvb2tFbClcbiAgICAgIGlmKGhvb2speyBob29rLl9fbW91bnRlZCgpIH1cbiAgICB9KVxuXG4gICAgdGhpcy5qb2luUGVuZGluZyA9IGZhbHNlXG4gICAgdGhpcy5saXZlU29ja2V0LmRpc3BhdGNoRXZlbnRzKGV2ZW50cylcbiAgICB0aGlzLmFwcGx5UGVuZGluZ1VwZGF0ZXMoKVxuXG4gICAgaWYobGl2ZV9wYXRjaCl7XG4gICAgICBsZXQge2tpbmQsIHRvfSA9IGxpdmVfcGF0Y2hcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpXG4gICAgfVxuICAgIHRoaXMuaGlkZUxvYWRlcigpXG4gICAgaWYodGhpcy5qb2luQ291bnQgPiAxKXsgdGhpcy50cmlnZ2VyUmVjb25uZWN0ZWQoKSB9XG4gICAgdGhpcy5zdG9wQ2FsbGJhY2soKVxuICB9XG5cbiAgdHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQudHJpZ2dlckRPTShcIm9uQmVmb3JlRWxVcGRhdGVkXCIsIFtmcm9tRWwsIHRvRWxdKVxuICAgIGxldCBob29rID0gdGhpcy5nZXRIb29rKGZyb21FbClcbiAgICBsZXQgaXNJZ25vcmVkID0gaG9vayAmJiBET00uaXNJZ25vcmVkKGZyb21FbCwgdGhpcy5iaW5kaW5nKFBIWF9VUERBVEUpKVxuICAgIGlmKGhvb2sgJiYgIWZyb21FbC5pc0VxdWFsTm9kZSh0b0VsKSAmJiAhKGlzSWdub3JlZCAmJiBpc0VxdWFsT2JqKGZyb21FbC5kYXRhc2V0LCB0b0VsLmRhdGFzZXQpKSl7XG4gICAgICBob29rLl9fYmVmb3JlVXBkYXRlKClcbiAgICAgIHJldHVybiBob29rXG4gICAgfVxuICB9XG5cbiAgcGVyZm9ybVBhdGNoKHBhdGNoLCBwcnVuZUNpZHMpe1xuICAgIGxldCByZW1vdmVkRWxzID0gW11cbiAgICBsZXQgcGh4Q2hpbGRyZW5BZGRlZCA9IGZhbHNlXG4gICAgbGV0IHVwZGF0ZWRIb29rSWRzID0gbmV3IFNldCgpXG5cbiAgICBwYXRjaC5hZnRlcihcImFkZGVkXCIsIGVsID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50cmlnZ2VyRE9NKFwib25Ob2RlQWRkZWRcIiwgW2VsXSlcblxuICAgICAgbGV0IG5ld0hvb2sgPSB0aGlzLmFkZEhvb2soZWwpXG4gICAgICBpZihuZXdIb29rKXsgbmV3SG9vay5fX21vdW50ZWQoKSB9XG4gICAgfSlcblxuICAgIHBhdGNoLmFmdGVyKFwicGh4Q2hpbGRBZGRlZFwiLCBlbCA9PiB7XG4gICAgICBpZihET00uaXNQaHhTdGlja3koZWwpKXtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LmpvaW5Sb290Vmlld3MoKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcGh4Q2hpbGRyZW5BZGRlZCA9IHRydWVcbiAgICAgIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYmVmb3JlKFwidXBkYXRlZFwiLCAoZnJvbUVsLCB0b0VsKSA9PiB7XG4gICAgICBsZXQgaG9vayA9IHRoaXMudHJpZ2dlckJlZm9yZVVwZGF0ZUhvb2soZnJvbUVsLCB0b0VsKVxuICAgICAgaWYoaG9vayl7IHVwZGF0ZWRIb29rSWRzLmFkZChmcm9tRWwuaWQpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ1cGRhdGVkXCIsIGVsID0+IHtcbiAgICAgIGlmKHVwZGF0ZWRIb29rSWRzLmhhcyhlbC5pZCkpeyB0aGlzLmdldEhvb2soZWwpLl9fdXBkYXRlZCgpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJkaXNjYXJkZWRcIiwgKGVsKSA9PiB7XG4gICAgICBpZihlbC5ub2RlVHlwZSA9PT0gTm9kZS5FTEVNRU5UX05PREUpeyByZW1vdmVkRWxzLnB1c2goZWwpIH1cbiAgICB9KVxuXG4gICAgcGF0Y2guYWZ0ZXIoXCJ0cmFuc2l0aW9uc0Rpc2NhcmRlZFwiLCBlbHMgPT4gdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChlbHMsIHBydW5lQ2lkcykpXG4gICAgcGF0Y2gucGVyZm9ybSgpXG4gICAgdGhpcy5hZnRlckVsZW1lbnRzUmVtb3ZlZChyZW1vdmVkRWxzLCBwcnVuZUNpZHMpXG5cbiAgICByZXR1cm4gcGh4Q2hpbGRyZW5BZGRlZFxuICB9XG5cbiAgYWZ0ZXJFbGVtZW50c1JlbW92ZWQoZWxlbWVudHMsIHBydW5lQ2lkcyl7XG4gICAgbGV0IGRlc3Ryb3llZENJRHMgPSBbXVxuICAgIGVsZW1lbnRzLmZvckVhY2gocGFyZW50ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnRzID0gRE9NLmFsbChwYXJlbnQsIGBbJHtQSFhfQ09NUE9ORU5UfV1gKVxuICAgICAgbGV0IGhvb2tzID0gRE9NLmFsbChwYXJlbnQsIGBbJHt0aGlzLmJpbmRpbmcoUEhYX0hPT0spfV1gKVxuICAgICAgY29tcG9uZW50cy5jb25jYXQocGFyZW50KS5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgbGV0IGNpZCA9IHRoaXMuY29tcG9uZW50SUQoZWwpXG4gICAgICAgIGlmKGlzQ2lkKGNpZCkgJiYgZGVzdHJveWVkQ0lEcy5pbmRleE9mKGNpZCkgPT09IC0xKXsgZGVzdHJveWVkQ0lEcy5wdXNoKGNpZCkgfVxuICAgICAgfSlcbiAgICAgIGhvb2tzLmNvbmNhdChwYXJlbnQpLmZvckVhY2goaG9va0VsID0+IHtcbiAgICAgICAgbGV0IGhvb2sgPSB0aGlzLmdldEhvb2soaG9va0VsKVxuICAgICAgICBob29rICYmIHRoaXMuZGVzdHJveUhvb2soaG9vaylcbiAgICAgIH0pXG4gICAgfSlcbiAgICAvLyBXZSBzaG91bGQgbm90IHBydW5lQ2lkcyBvbiBqb2lucy4gT3RoZXJ3aXNlLCBpbiBjYXNlIG9mXG4gICAgLy8gcmVqb2lucywgd2UgbWF5IG5vdGlmeSBjaWRzIHRoYXQgbm8gbG9uZ2VyIGJlbG9uZyB0byB0aGVcbiAgICAvLyBjdXJyZW50IExpdmVWaWV3IHRvIGJlIHJlbW92ZWQuXG4gICAgaWYocHJ1bmVDaWRzKXtcbiAgICAgIHRoaXMubWF5YmVQdXNoQ29tcG9uZW50c0Rlc3Ryb3llZChkZXN0cm95ZWRDSURzKVxuICAgIH1cbiAgfVxuXG4gIGpvaW5OZXdDaGlsZHJlbigpe1xuICAgIERPTS5maW5kUGh4Q2hpbGRyZW4odGhpcy5lbCwgdGhpcy5pZCkuZm9yRWFjaChlbCA9PiB0aGlzLmpvaW5DaGlsZChlbCkpXG4gIH1cblxuICBnZXRDaGlsZEJ5SWQoaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3RoaXMuaWRdW2lkXSB9XG5cbiAgZ2V0RGVzY2VuZGVudEJ5RWwoZWwpe1xuICAgIGlmKGVsLmlkID09PSB0aGlzLmlkKXtcbiAgICAgIHJldHVybiB0aGlzXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2VsLmdldEF0dHJpYnV0ZShQSFhfUEFSRU5UX0lEKV1bZWwuaWRdXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveURlc2NlbmRlbnQoaWQpe1xuICAgIGZvcihsZXQgcGFyZW50SWQgaW4gdGhpcy5yb290LmNoaWxkcmVuKXtcbiAgICAgIGZvcihsZXQgY2hpbGRJZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bcGFyZW50SWRdKXtcbiAgICAgICAgaWYoY2hpbGRJZCA9PT0gaWQpeyByZXR1cm4gdGhpcy5yb290LmNoaWxkcmVuW3BhcmVudElkXVtjaGlsZElkXS5kZXN0cm95KCkgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGpvaW5DaGlsZChlbCl7XG4gICAgbGV0IGNoaWxkID0gdGhpcy5nZXRDaGlsZEJ5SWQoZWwuaWQpXG4gICAgaWYoIWNoaWxkKXtcbiAgICAgIGxldCB2aWV3ID0gbmV3IFZpZXcoZWwsIHRoaXMubGl2ZVNvY2tldCwgdGhpcylcbiAgICAgIHRoaXMucm9vdC5jaGlsZHJlblt0aGlzLmlkXVt2aWV3LmlkXSA9IHZpZXdcbiAgICAgIHZpZXcuam9pbigpXG4gICAgICB0aGlzLmNoaWxkSm9pbnMrK1xuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gIH1cblxuICBpc0pvaW5QZW5kaW5nKCl7IHJldHVybiB0aGlzLmpvaW5QZW5kaW5nIH1cblxuICBhY2tKb2luKF9jaGlsZCl7XG4gICAgdGhpcy5jaGlsZEpvaW5zLS1cblxuICAgIGlmKHRoaXMuY2hpbGRKb2lucyA9PT0gMCl7XG4gICAgICBpZih0aGlzLnBhcmVudCl7XG4gICAgICAgIHRoaXMucGFyZW50LmFja0pvaW4odGhpcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25BbGxDaGlsZEpvaW5zQ29tcGxldGUoKVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uQWxsQ2hpbGRKb2luc0NvbXBsZXRlKCl7XG4gICAgdGhpcy5qb2luQ2FsbGJhY2soKCkgPT4ge1xuICAgICAgdGhpcy5wZW5kaW5nSm9pbk9wcy5mb3JFYWNoKChbdmlldywgb3BdKSA9PiB7XG4gICAgICAgIGlmKCF2aWV3LmlzRGVzdHJveWVkKCkpeyBvcCgpIH1cbiAgICAgIH0pXG4gICAgICB0aGlzLnBlbmRpbmdKb2luT3BzID0gW11cbiAgICB9KVxuICB9XG5cbiAgdXBkYXRlKGRpZmYsIGV2ZW50cyl7XG4gICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkgfHwgKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmICFET00uaXNQaHhTdGlja3kodGhpcy5lbCkpKXtcbiAgICAgIHJldHVybiB0aGlzLnBlbmRpbmdEaWZmcy5wdXNoKHtkaWZmLCBldmVudHN9KVxuICAgIH1cblxuICAgIHRoaXMucmVuZGVyZWQubWVyZ2VEaWZmKGRpZmYpXG4gICAgbGV0IHBoeENoaWxkcmVuQWRkZWQgPSBmYWxzZVxuXG4gICAgLy8gV2hlbiB0aGUgZGlmZiBvbmx5IGNvbnRhaW5zIGNvbXBvbmVudCBkaWZmcywgdGhlbiB3YWxrIGNvbXBvbmVudHNcbiAgICAvLyBhbmQgcGF0Y2ggb25seSB0aGUgcGFyZW50IGNvbXBvbmVudCBjb250YWluZXJzIGZvdW5kIGluIHRoZSBkaWZmLlxuICAgIC8vIE90aGVyd2lzZSwgcGF0Y2ggZW50aXJlIExWIGNvbnRhaW5lci5cbiAgICBpZih0aGlzLnJlbmRlcmVkLmlzQ29tcG9uZW50T25seURpZmYoZGlmZikpe1xuICAgICAgdGhpcy5saXZlU29ja2V0LnRpbWUoXCJjb21wb25lbnQgcGF0Y2ggY29tcGxldGVcIiwgKCkgPT4ge1xuICAgICAgICBsZXQgcGFyZW50Q2lkcyA9IERPTS5maW5kUGFyZW50Q0lEcyh0aGlzLmVsLCB0aGlzLnJlbmRlcmVkLmNvbXBvbmVudENJRHMoZGlmZikpXG4gICAgICAgIHBhcmVudENpZHMuZm9yRWFjaChwYXJlbnRDSUQgPT4ge1xuICAgICAgICAgIGlmKHRoaXMuY29tcG9uZW50UGF0Y2godGhpcy5yZW5kZXJlZC5nZXRDb21wb25lbnQoZGlmZiwgcGFyZW50Q0lEKSwgcGFyZW50Q0lEKSl7IHBoeENoaWxkcmVuQWRkZWQgPSB0cnVlIH1cbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIGlmKCFpc0VtcHR5KGRpZmYpKXtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC50aW1lKFwiZnVsbCBwYXRjaCBjb21wbGV0ZVwiLCAoKSA9PiB7XG4gICAgICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJDb250YWluZXIoZGlmZiwgXCJ1cGRhdGVcIilcbiAgICAgICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIG51bGwpXG4gICAgICAgIHBoeENoaWxkcmVuQWRkZWQgPSB0aGlzLnBlcmZvcm1QYXRjaChwYXRjaCwgdHJ1ZSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5saXZlU29ja2V0LmRpc3BhdGNoRXZlbnRzKGV2ZW50cylcbiAgICBpZihwaHhDaGlsZHJlbkFkZGVkKXsgdGhpcy5qb2luTmV3Q2hpbGRyZW4oKSB9XG4gIH1cblxuICByZW5kZXJDb250YWluZXIoZGlmZiwga2luZCl7XG4gICAgcmV0dXJuIHRoaXMubGl2ZVNvY2tldC50aW1lKGB0b1N0cmluZyBkaWZmICgke2tpbmR9KWAsICgpID0+IHtcbiAgICAgIGxldCB0YWcgPSB0aGlzLmVsLnRhZ05hbWVcbiAgICAgIC8vIERvbid0IHNraXAgYW55IGNvbXBvbmVudCBpbiB0aGUgZGlmZiBub3IgYW55IG1hcmtlZCBhcyBwcnVuZWRcbiAgICAgIC8vIChhcyB0aGV5IG1heSBoYXZlIGJlZW4gYWRkZWQgYmFjaylcbiAgICAgIGxldCBjaWRzID0gZGlmZiA/IHRoaXMucmVuZGVyZWQuY29tcG9uZW50Q0lEcyhkaWZmKS5jb25jYXQodGhpcy5wcnVuaW5nQ0lEcykgOiBudWxsXG4gICAgICBsZXQgaHRtbCA9IHRoaXMucmVuZGVyZWQudG9TdHJpbmcoY2lkcylcbiAgICAgIHJldHVybiBgPCR7dGFnfT4ke2h0bWx9PC8ke3RhZ30+YFxuICAgIH0pXG4gIH1cblxuICBjb21wb25lbnRQYXRjaChkaWZmLCBjaWQpe1xuICAgIGlmKGlzRW1wdHkoZGlmZikpIHJldHVybiBmYWxzZVxuICAgIGxldCBodG1sID0gdGhpcy5yZW5kZXJlZC5jb21wb25lbnRUb1N0cmluZyhjaWQpXG4gICAgbGV0IHBhdGNoID0gbmV3IERPTVBhdGNoKHRoaXMsIHRoaXMuZWwsIHRoaXMuaWQsIGh0bWwsIGNpZClcbiAgICBsZXQgY2hpbGRyZW5BZGRlZCA9IHRoaXMucGVyZm9ybVBhdGNoKHBhdGNoLCB0cnVlKVxuICAgIHJldHVybiBjaGlsZHJlbkFkZGVkXG4gIH1cblxuICBnZXRIb29rKGVsKXsgcmV0dXJuIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChlbCldIH1cblxuICBhZGRIb29rKGVsKXtcbiAgICBpZihWaWV3SG9vay5lbGVtZW50SUQoZWwpIHx8ICFlbC5nZXRBdHRyaWJ1dGUpeyByZXR1cm4gfVxuICAgIGxldCBob29rTmFtZSA9IGVsLmdldEF0dHJpYnV0ZShgZGF0YS1waHgtJHtQSFhfSE9PS31gKSB8fCBlbC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9IT09LKSlcbiAgICBpZihob29rTmFtZSAmJiAhdGhpcy5vd25zRWxlbWVudChlbCkpeyByZXR1cm4gfVxuICAgIGxldCBjYWxsYmFja3MgPSB0aGlzLmxpdmVTb2NrZXQuZ2V0SG9va0NhbGxiYWNrcyhob29rTmFtZSlcblxuICAgIGlmKGNhbGxiYWNrcyl7XG4gICAgICBpZighZWwuaWQpeyBsb2dFcnJvcihgbm8gRE9NIElEIGZvciBob29rIFwiJHtob29rTmFtZX1cIi4gSG9va3MgcmVxdWlyZSBhIHVuaXF1ZSBJRCBvbiBlYWNoIGVsZW1lbnQuYCwgZWwpIH1cbiAgICAgIGxldCBob29rID0gbmV3IFZpZXdIb29rKHRoaXMsIGVsLCBjYWxsYmFja3MpXG4gICAgICB0aGlzLnZpZXdIb29rc1tWaWV3SG9vay5lbGVtZW50SUQoaG9vay5lbCldID0gaG9va1xuICAgICAgcmV0dXJuIGhvb2tcbiAgICB9IGVsc2UgaWYoaG9va05hbWUgIT09IG51bGwpe1xuICAgICAgbG9nRXJyb3IoYHVua25vd24gaG9vayBmb3VuZCBmb3IgXCIke2hvb2tOYW1lfVwiYCwgZWwpXG4gICAgfVxuICB9XG5cbiAgZGVzdHJveUhvb2soaG9vayl7XG4gICAgaG9vay5fX2Rlc3Ryb3llZCgpXG4gICAgaG9vay5fX2NsZWFudXBfXygpXG4gICAgZGVsZXRlIHRoaXMudmlld0hvb2tzW1ZpZXdIb29rLmVsZW1lbnRJRChob29rLmVsKV1cbiAgfVxuXG4gIGFwcGx5UGVuZGluZ1VwZGF0ZXMoKXtcbiAgICB0aGlzLnBlbmRpbmdEaWZmcy5mb3JFYWNoKCh7ZGlmZiwgZXZlbnRzfSkgPT4gdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKSlcbiAgICB0aGlzLnBlbmRpbmdEaWZmcyA9IFtdXG4gIH1cblxuICBvbkNoYW5uZWwoZXZlbnQsIGNiKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQub25DaGFubmVsKHRoaXMuY2hhbm5lbCwgZXZlbnQsIHJlc3AgPT4ge1xuICAgICAgaWYodGhpcy5pc0pvaW5QZW5kaW5nKCkpe1xuICAgICAgICB0aGlzLnJvb3QucGVuZGluZ0pvaW5PcHMucHVzaChbdGhpcywgKCkgPT4gY2IocmVzcCldKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5saXZlU29ja2V0LnJlcXVlc3RET01VcGRhdGUoKCkgPT4gY2IocmVzcCkpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGJpbmRDaGFubmVsKCl7XG4gICAgLy8gVGhlIGRpZmYgZXZlbnQgc2hvdWxkIGJlIGhhbmRsZWQgYnkgdGhlIHJlZ3VsYXIgdXBkYXRlIG9wZXJhdGlvbnMuXG4gICAgLy8gQWxsIG90aGVyIG9wZXJhdGlvbnMgYXJlIHF1ZXVlZCB0byBiZSBhcHBsaWVkIG9ubHkgYWZ0ZXIgam9pbi5cbiAgICB0aGlzLmxpdmVTb2NrZXQub25DaGFubmVsKHRoaXMuY2hhbm5lbCwgXCJkaWZmXCIsIChyYXdEaWZmKSA9PiB7XG4gICAgICB0aGlzLmxpdmVTb2NrZXQucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuYXBwbHlEaWZmKFwidXBkYXRlXCIsIHJhd0RpZmYsICh7ZGlmZiwgZXZlbnRzfSkgPT4gdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKSlcbiAgICAgIH0pXG4gICAgfSlcbiAgICB0aGlzLm9uQ2hhbm5lbChcInJlZGlyZWN0XCIsICh7dG8sIGZsYXNofSkgPT4gdGhpcy5vblJlZGlyZWN0KHt0bywgZmxhc2h9KSlcbiAgICB0aGlzLm9uQ2hhbm5lbChcImxpdmVfcGF0Y2hcIiwgKHJlZGlyKSA9PiB0aGlzLm9uTGl2ZVBhdGNoKHJlZGlyKSlcbiAgICB0aGlzLm9uQ2hhbm5lbChcImxpdmVfcmVkaXJlY3RcIiwgKHJlZGlyKSA9PiB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlZGlyKSlcbiAgICB0aGlzLmNoYW5uZWwub25FcnJvcihyZWFzb24gPT4gdGhpcy5vbkVycm9yKHJlYXNvbikpXG4gICAgdGhpcy5jaGFubmVsLm9uQ2xvc2UocmVhc29uID0+IHRoaXMub25DbG9zZShyZWFzb24pKVxuICB9XG5cbiAgZGVzdHJveUFsbENoaWxkcmVuKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnJvb3QuY2hpbGRyZW5bdGhpcy5pZF0pe1xuICAgICAgdGhpcy5nZXRDaGlsZEJ5SWQoaWQpLmRlc3Ryb3koKVxuICAgIH1cbiAgfVxuXG4gIG9uTGl2ZVJlZGlyZWN0KHJlZGlyKXtcbiAgICBsZXQge3RvLCBraW5kLCBmbGFzaH0gPSByZWRpclxuICAgIGxldCB1cmwgPSB0aGlzLmV4cGFuZFVSTCh0bylcbiAgICB0aGlzLmxpdmVTb2NrZXQuaGlzdG9yeVJlZGlyZWN0KHVybCwga2luZCwgZmxhc2gpXG4gIH1cblxuICBvbkxpdmVQYXRjaChyZWRpcil7XG4gICAgbGV0IHt0bywga2luZH0gPSByZWRpclxuICAgIHRoaXMuaHJlZiA9IHRoaXMuZXhwYW5kVVJMKHRvKVxuICAgIHRoaXMubGl2ZVNvY2tldC5oaXN0b3J5UGF0Y2godG8sIGtpbmQpXG4gIH1cblxuICBleHBhbmRVUkwodG8pe1xuICAgIHJldHVybiB0by5zdGFydHNXaXRoKFwiL1wiKSA/IGAke3dpbmRvdy5sb2NhdGlvbi5wcm90b2NvbH0vLyR7d2luZG93LmxvY2F0aW9uLmhvc3R9JHt0b31gIDogdG9cbiAgfVxuXG4gIG9uUmVkaXJlY3Qoe3RvLCBmbGFzaH0peyB0aGlzLmxpdmVTb2NrZXQucmVkaXJlY3QodG8sIGZsYXNoKSB9XG5cbiAgaXNEZXN0cm95ZWQoKXsgcmV0dXJuIHRoaXMuZGVzdHJveWVkIH1cblxuICBqb2luKGNhbGxiYWNrKXtcbiAgICBpZih0aGlzLmlzTWFpbigpKXtcbiAgICAgIHRoaXMuc3RvcENhbGxiYWNrID0gdGhpcy5saXZlU29ja2V0LndpdGhQYWdlTG9hZGluZyh7dG86IHRoaXMuaHJlZiwga2luZDogXCJpbml0aWFsXCJ9KVxuICAgIH1cbiAgICB0aGlzLmpvaW5DYWxsYmFjayA9IChvbkRvbmUpID0+IHtcbiAgICAgIG9uRG9uZSA9IG9uRG9uZSB8fCBmdW5jdGlvbigpe31cbiAgICAgIGNhbGxiYWNrID8gY2FsbGJhY2sodGhpcy5qb2luQ291bnQsIG9uRG9uZSkgOiBvbkRvbmUoKVxuICAgIH1cbiAgICB0aGlzLmxpdmVTb2NrZXQud3JhcFB1c2godGhpcywge3RpbWVvdXQ6IGZhbHNlfSwgKCkgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5qb2luKClcbiAgICAgICAgLnJlY2VpdmUoXCJva1wiLCBkYXRhID0+IHtcbiAgICAgICAgICBpZighdGhpcy5pc0Rlc3Ryb3llZCgpKXtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHRoaXMub25Kb2luKGRhdGEpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgLnJlY2VpdmUoXCJlcnJvclwiLCByZXNwID0+ICF0aGlzLmlzRGVzdHJveWVkKCkgJiYgdGhpcy5vbkpvaW5FcnJvcihyZXNwKSlcbiAgICAgICAgLnJlY2VpdmUoXCJ0aW1lb3V0XCIsICgpID0+ICF0aGlzLmlzRGVzdHJveWVkKCkgJiYgdGhpcy5vbkpvaW5FcnJvcih7cmVhc29uOiBcInRpbWVvdXRcIn0pKVxuICAgIH0pXG4gIH1cblxuICBvbkpvaW5FcnJvcihyZXNwKXtcbiAgICBpZihyZXNwLnJlYXNvbiA9PT0gXCJ1bmF1dGhvcml6ZWRcIiB8fCByZXNwLnJlYXNvbiA9PT0gXCJzdGFsZVwiKXtcbiAgICAgIHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widW5hdXRob3JpemVkIGxpdmVfcmVkaXJlY3QuIEZhbGxpbmcgYmFjayB0byBwYWdlIHJlcXVlc3RcIiwgcmVzcF0pXG4gICAgICByZXR1cm4gdGhpcy5vblJlZGlyZWN0KHt0bzogdGhpcy5ocmVmfSlcbiAgICB9XG4gICAgaWYocmVzcC5yZWRpcmVjdCB8fCByZXNwLmxpdmVfcmVkaXJlY3Qpe1xuICAgICAgdGhpcy5qb2luUGVuZGluZyA9IGZhbHNlXG4gICAgICB0aGlzLmNoYW5uZWwubGVhdmUoKVxuICAgIH1cbiAgICBpZihyZXNwLnJlZGlyZWN0KXsgcmV0dXJuIHRoaXMub25SZWRpcmVjdChyZXNwLnJlZGlyZWN0KSB9XG4gICAgaWYocmVzcC5saXZlX3JlZGlyZWN0KXsgcmV0dXJuIHRoaXMub25MaXZlUmVkaXJlY3QocmVzcC5saXZlX3JlZGlyZWN0KSB9XG4gICAgdGhpcy5sb2coXCJlcnJvclwiLCAoKSA9PiBbXCJ1bmFibGUgdG8gam9pblwiLCByZXNwXSlcbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMubGl2ZVNvY2tldC5yZWxvYWRXaXRoSml0dGVyKHRoaXMpIH1cbiAgfVxuXG4gIG9uQ2xvc2UocmVhc29uKXtcbiAgICBpZih0aGlzLmlzRGVzdHJveWVkKCkpeyByZXR1cm4gfVxuICAgIGlmKHRoaXMubGl2ZVNvY2tldC5oYXNQZW5kaW5nTGluaygpICYmIHJlYXNvbiAhPT0gXCJsZWF2ZVwiKXtcbiAgICAgIHJldHVybiB0aGlzLmxpdmVTb2NrZXQucmVsb2FkV2l0aEppdHRlcih0aGlzKVxuICAgIH1cbiAgICB0aGlzLmRlc3Ryb3lBbGxDaGlsZHJlbigpXG4gICAgdGhpcy5saXZlU29ja2V0LmRyb3BBY3RpdmVFbGVtZW50KHRoaXMpXG4gICAgLy8gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCBjYW4gYmUgbnVsbCBpbiBJbnRlcm5ldCBFeHBsb3JlciAxMVxuICAgIGlmKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpeyBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKSB9XG4gICAgaWYodGhpcy5saXZlU29ja2V0LmlzVW5sb2FkZWQoKSl7XG4gICAgICB0aGlzLnNob3dMb2FkZXIoQkVGT1JFX1VOTE9BRF9MT0FERVJfVElNRU9VVClcbiAgICB9XG4gIH1cblxuICBvbkVycm9yKHJlYXNvbil7XG4gICAgdGhpcy5vbkNsb3NlKHJlYXNvbilcbiAgICBpZih0aGlzLmxpdmVTb2NrZXQuaXNDb25uZWN0ZWQoKSl7IHRoaXMubG9nKFwiZXJyb3JcIiwgKCkgPT4gW1widmlldyBjcmFzaGVkXCIsIHJlYXNvbl0pIH1cbiAgICBpZighdGhpcy5saXZlU29ja2V0LmlzVW5sb2FkZWQoKSl7IHRoaXMuZGlzcGxheUVycm9yKCkgfVxuICB9XG5cbiAgZGlzcGxheUVycm9yKCl7XG4gICAgaWYodGhpcy5pc01haW4oKSl7IERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIHtkZXRhaWw6IHt0bzogdGhpcy5ocmVmLCBraW5kOiBcImVycm9yXCJ9fSkgfVxuICAgIHRoaXMuc2hvd0xvYWRlcigpXG4gICAgdGhpcy5zZXRDb250YWluZXJDbGFzc2VzKFBIWF9ESVNDT05ORUNURURfQ0xBU1MsIFBIWF9FUlJPUl9DTEFTUylcbiAgfVxuXG4gIHB1c2hXaXRoUmVwbHkocmVmR2VuZXJhdG9yLCBldmVudCwgcGF5bG9hZCwgb25SZXBseSA9IGZ1bmN0aW9uICgpeyB9KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXsgcmV0dXJuIH1cblxuICAgIGxldCBbcmVmLCBbZWxdLCBvcHRzXSA9IHJlZkdlbmVyYXRvciA/IHJlZkdlbmVyYXRvcigpIDogW251bGwsIFtdLCB7fV1cbiAgICBsZXQgb25Mb2FkaW5nRG9uZSA9IGZ1bmN0aW9uKCl7IH1cbiAgICBpZihvcHRzLnBhZ2VfbG9hZGluZyB8fCAoZWwgJiYgKGVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX1BBR0VfTE9BRElORykpICE9PSBudWxsKSkpe1xuICAgICAgb25Mb2FkaW5nRG9uZSA9IHRoaXMubGl2ZVNvY2tldC53aXRoUGFnZUxvYWRpbmcoe2tpbmQ6IFwiZWxlbWVudFwiLCB0YXJnZXQ6IGVsfSlcbiAgICB9XG5cbiAgICBpZih0eXBlb2YgKHBheWxvYWQuY2lkKSAhPT0gXCJudW1iZXJcIil7IGRlbGV0ZSBwYXlsb2FkLmNpZCB9XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMubGl2ZVNvY2tldC53cmFwUHVzaCh0aGlzLCB7dGltZW91dDogdHJ1ZX0sICgpID0+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhbm5lbC5wdXNoKGV2ZW50LCBwYXlsb2FkLCBQVVNIX1RJTUVPVVQpLnJlY2VpdmUoXCJva1wiLCByZXNwID0+IHtcbiAgICAgICAgICBpZihyZWYgIT09IG51bGwpeyB0aGlzLnVuZG9SZWZzKHJlZikgfVxuICAgICAgICAgIGxldCBmaW5pc2ggPSAoaG9va1JlcGx5KSA9PiB7XG4gICAgICAgICAgICBpZihyZXNwLnJlZGlyZWN0KXsgdGhpcy5vblJlZGlyZWN0KHJlc3AucmVkaXJlY3QpIH1cbiAgICAgICAgICAgIGlmKHJlc3AubGl2ZV9wYXRjaCl7IHRoaXMub25MaXZlUGF0Y2gocmVzcC5saXZlX3BhdGNoKSB9XG4gICAgICAgICAgICBpZihyZXNwLmxpdmVfcmVkaXJlY3QpeyB0aGlzLm9uTGl2ZVJlZGlyZWN0KHJlc3AubGl2ZV9yZWRpcmVjdCkgfVxuICAgICAgICAgICAgb25Mb2FkaW5nRG9uZSgpXG4gICAgICAgICAgICBvblJlcGx5KHJlc3AsIGhvb2tSZXBseSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYocmVzcC5kaWZmKXtcbiAgICAgICAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgICAgICAgbGV0IGhvb2tSZXBseSA9IHRoaXMuYXBwbHlEaWZmKFwidXBkYXRlXCIsIHJlc3AuZGlmZiwgKHtkaWZmLCBldmVudHN9KSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGUoZGlmZiwgZXZlbnRzKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICBmaW5pc2goaG9va1JlcGx5KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZmluaXNoKG51bGwpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICB1bmRvUmVmcyhyZWYpe1xuICAgIERPTS5hbGwoZG9jdW1lbnQsIGBbJHtQSFhfUkVGX1NSQ309XCIke3RoaXMuaWR9XCJdWyR7UEhYX1JFRn09XCIke3JlZn1cIl1gLCBlbCA9PiB7XG4gICAgICBsZXQgZGlzYWJsZWRWYWwgPSBlbC5nZXRBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgLy8gcmVtb3ZlIHJlZnNcbiAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfUkVGKVxuICAgICAgZWwucmVtb3ZlQXR0cmlidXRlKFBIWF9SRUZfU1JDKVxuICAgICAgLy8gcmVzdG9yZSBpbnB1dHNcbiAgICAgIGlmKGVsLmdldEF0dHJpYnV0ZShQSFhfUkVBRE9OTFkpICE9PSBudWxsKXtcbiAgICAgICAgZWwucmVhZE9ubHkgPSBmYWxzZVxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX1JFQURPTkxZKVxuICAgICAgfVxuICAgICAgaWYoZGlzYWJsZWRWYWwgIT09IG51bGwpe1xuICAgICAgICBlbC5kaXNhYmxlZCA9IGRpc2FibGVkVmFsID09PSBcInRydWVcIiA/IHRydWUgOiBmYWxzZVxuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoUEhYX0RJU0FCTEVEKVxuICAgICAgfVxuICAgICAgLy8gcmVtb3ZlIGNsYXNzZXNcbiAgICAgIFBIWF9FVkVOVF9DTEFTU0VTLmZvckVhY2goY2xhc3NOYW1lID0+IERPTS5yZW1vdmVDbGFzcyhlbCwgY2xhc3NOYW1lKSlcbiAgICAgIC8vIHJlc3RvcmUgZGlzYWJsZXNcbiAgICAgIGxldCBkaXNhYmxlUmVzdG9yZSA9IGVsLmdldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICBpZihkaXNhYmxlUmVzdG9yZSAhPT0gbnVsbCl7XG4gICAgICAgIGVsLmlubmVyVGV4dCA9IGRpc2FibGVSZXN0b3JlXG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUpXG4gICAgICB9XG4gICAgICBsZXQgdG9FbCA9IERPTS5wcml2YXRlKGVsLCBQSFhfUkVGKVxuICAgICAgaWYodG9FbCl7XG4gICAgICAgIGxldCBob29rID0gdGhpcy50cmlnZ2VyQmVmb3JlVXBkYXRlSG9vayhlbCwgdG9FbClcbiAgICAgICAgRE9NUGF0Y2gucGF0Y2hFbChlbCwgdG9FbCwgdGhpcy5saXZlU29ja2V0LmdldEFjdGl2ZUVsZW1lbnQoKSlcbiAgICAgICAgaWYoaG9vayl7IGhvb2suX191cGRhdGVkKCkgfVxuICAgICAgICBET00uZGVsZXRlUHJpdmF0ZShlbCwgUEhYX1JFRilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgcHV0UmVmKGVsZW1lbnRzLCBldmVudCwgb3B0cyA9IHt9KXtcbiAgICBsZXQgbmV3UmVmID0gdGhpcy5yZWYrK1xuICAgIGxldCBkaXNhYmxlV2l0aCA9IHRoaXMuYmluZGluZyhQSFhfRElTQUJMRV9XSVRIKVxuICAgIGlmKG9wdHMubG9hZGluZyl7IGVsZW1lbnRzID0gZWxlbWVudHMuY29uY2F0KERPTS5hbGwoZG9jdW1lbnQsIG9wdHMubG9hZGluZykpfVxuXG4gICAgZWxlbWVudHMuZm9yRWFjaChlbCA9PiB7XG4gICAgICBlbC5jbGFzc0xpc3QuYWRkKGBwaHgtJHtldmVudH0tbG9hZGluZ2ApXG4gICAgICBlbC5zZXRBdHRyaWJ1dGUoUEhYX1JFRiwgbmV3UmVmKVxuICAgICAgZWwuc2V0QXR0cmlidXRlKFBIWF9SRUZfU1JDLCB0aGlzLmVsLmlkKVxuICAgICAgbGV0IGRpc2FibGVUZXh0ID0gZWwuZ2V0QXR0cmlidXRlKGRpc2FibGVXaXRoKVxuICAgICAgaWYoZGlzYWJsZVRleHQgIT09IG51bGwpe1xuICAgICAgICBpZighZWwuZ2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFX1dJVEhfUkVTVE9SRSkpe1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRV9XSVRIX1JFU1RPUkUsIGVsLmlubmVyVGV4dClcbiAgICAgICAgfVxuICAgICAgICBpZihkaXNhYmxlVGV4dCAhPT0gXCJcIil7IGVsLmlubmVyVGV4dCA9IGRpc2FibGVUZXh0IH1cbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiZGlzYWJsZWRcIiwgXCJcIilcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBbbmV3UmVmLCBlbGVtZW50cywgb3B0c11cbiAgfVxuXG4gIGNvbXBvbmVudElEKGVsKXtcbiAgICBsZXQgY2lkID0gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfQ09NUE9ORU5UKVxuICAgIHJldHVybiBjaWQgPyBwYXJzZUludChjaWQpIDogbnVsbFxuICB9XG5cbiAgdGFyZ2V0Q29tcG9uZW50SUQodGFyZ2V0LCB0YXJnZXRDdHgsIG9wdHMgPSB7fSl7XG4gICAgaWYoaXNDaWQodGFyZ2V0Q3R4KSl7IHJldHVybiB0YXJnZXRDdHggfVxuXG4gICAgbGV0IGNpZE9yU2VsZWN0b3IgPSB0YXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcInRhcmdldFwiKSlcbiAgICBpZihpc0NpZChjaWRPclNlbGVjdG9yKSl7XG4gICAgICByZXR1cm4gcGFyc2VJbnQoY2lkT3JTZWxlY3RvcilcbiAgICB9IGVsc2UgaWYodGFyZ2V0Q3R4ICYmIChjaWRPclNlbGVjdG9yICE9PSBudWxsIHx8IG9wdHMudGFyZ2V0KSl7XG4gICAgICByZXR1cm4gdGhpcy5jbG9zZXN0Q29tcG9uZW50SUQodGFyZ2V0Q3R4KVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbFxuICAgIH1cbiAgfVxuXG4gIGNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpe1xuICAgIGlmKGlzQ2lkKHRhcmdldEN0eCkpe1xuICAgICAgcmV0dXJuIHRhcmdldEN0eFxuICAgIH0gZWxzZSBpZih0YXJnZXRDdHgpe1xuICAgICAgcmV0dXJuIG1heWJlKHRhcmdldEN0eC5jbG9zZXN0KGBbJHtQSFhfQ09NUE9ORU5UfV1gKSwgZWwgPT4gdGhpcy5vd25zRWxlbWVudChlbCkgJiYgdGhpcy5jb21wb25lbnRJRChlbCkpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBudWxsXG4gICAgfVxuICB9XG5cbiAgcHVzaEhvb2tFdmVudCh0YXJnZXRDdHgsIGV2ZW50LCBwYXlsb2FkLCBvblJlcGx5KXtcbiAgICBpZighdGhpcy5pc0Nvbm5lY3RlZCgpKXtcbiAgICAgIHRoaXMubG9nKFwiaG9va1wiLCAoKSA9PiBbXCJ1bmFibGUgdG8gcHVzaCBob29rIGV2ZW50LiBMaXZlVmlldyBub3QgY29ubmVjdGVkXCIsIGV2ZW50LCBwYXlsb2FkXSlcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgICBsZXQgW3JlZiwgZWxzLCBvcHRzXSA9IHRoaXMucHV0UmVmKFtdLCBcImhvb2tcIilcbiAgICB0aGlzLnB1c2hXaXRoUmVwbHkoKCkgPT4gW3JlZiwgZWxzLCBvcHRzXSwgXCJldmVudFwiLCB7XG4gICAgICB0eXBlOiBcImhvb2tcIixcbiAgICAgIGV2ZW50OiBldmVudCxcbiAgICAgIHZhbHVlOiBwYXlsb2FkLFxuICAgICAgY2lkOiB0aGlzLmNsb3Nlc3RDb21wb25lbnRJRCh0YXJnZXRDdHgpXG4gICAgfSwgKHJlc3AsIHJlcGx5KSA9PiBvblJlcGx5KHJlcGx5LCByZWYpKVxuXG4gICAgcmV0dXJuIHJlZlxuICB9XG5cbiAgZXh0cmFjdE1ldGEoZWwsIG1ldGEsIHZhbHVlKXtcbiAgICBsZXQgcHJlZml4ID0gdGhpcy5iaW5kaW5nKFwidmFsdWUtXCIpXG4gICAgZm9yKGxldCBpID0gMDsgaSA8IGVsLmF0dHJpYnV0ZXMubGVuZ3RoOyBpKyspe1xuICAgICAgaWYoIW1ldGEpeyBtZXRhID0ge30gfVxuICAgICAgbGV0IG5hbWUgPSBlbC5hdHRyaWJ1dGVzW2ldLm5hbWVcbiAgICAgIGlmKG5hbWUuc3RhcnRzV2l0aChwcmVmaXgpKXsgbWV0YVtuYW1lLnJlcGxhY2UocHJlZml4LCBcIlwiKV0gPSBlbC5nZXRBdHRyaWJ1dGUobmFtZSkgfVxuICAgIH1cbiAgICBpZihlbC52YWx1ZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIGlmKCFtZXRhKXsgbWV0YSA9IHt9IH1cbiAgICAgIG1ldGEudmFsdWUgPSBlbC52YWx1ZVxuXG4gICAgICBpZihlbC50YWdOYW1lID09PSBcIklOUFVUXCIgJiYgQ0hFQ0tBQkxFX0lOUFVUUy5pbmRleE9mKGVsLnR5cGUpID49IDAgJiYgIWVsLmNoZWNrZWQpe1xuICAgICAgICBkZWxldGUgbWV0YS52YWx1ZVxuICAgICAgfVxuICAgIH1cbiAgICBpZih2YWx1ZSl7XG4gICAgICBpZighbWV0YSl7IG1ldGEgPSB7fSB9XG4gICAgICBmb3IobGV0IGtleSBpbiB2YWx1ZSl7IG1ldGFba2V5XSA9IHZhbHVlW2tleV0gfVxuICAgIH1cbiAgICByZXR1cm4gbWV0YVxuICB9XG5cbiAgcHVzaEV2ZW50KHR5cGUsIGVsLCB0YXJnZXRDdHgsIHBoeEV2ZW50LCBtZXRhLCBvcHRzID0ge30pe1xuICAgIHRoaXMucHVzaFdpdGhSZXBseSgoKSA9PiB0aGlzLnB1dFJlZihbZWxdLCB0eXBlLCBvcHRzKSwgXCJldmVudFwiLCB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgdmFsdWU6IHRoaXMuZXh0cmFjdE1ldGEoZWwsIG1ldGEsIG9wdHMudmFsdWUpLFxuICAgICAgY2lkOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGVsLCB0YXJnZXRDdHgsIG9wdHMpXG4gICAgfSlcbiAgfVxuXG4gIHB1c2hGaWxlUHJvZ3Jlc3MoZmlsZUVsLCBlbnRyeVJlZiwgcHJvZ3Jlc3MsIG9uUmVwbHkgPSBmdW5jdGlvbiAoKXsgfSl7XG4gICAgdGhpcy5saXZlU29ja2V0LndpdGhpbk93bmVycyhmaWxlRWwuZm9ybSwgKHZpZXcsIHRhcmdldEN0eCkgPT4ge1xuICAgICAgdmlldy5wdXNoV2l0aFJlcGx5KG51bGwsIFwicHJvZ3Jlc3NcIiwge1xuICAgICAgICBldmVudDogZmlsZUVsLmdldEF0dHJpYnV0ZSh2aWV3LmJpbmRpbmcoUEhYX1BST0dSRVNTKSksXG4gICAgICAgIHJlZjogZmlsZUVsLmdldEF0dHJpYnV0ZShQSFhfVVBMT0FEX1JFRiksXG4gICAgICAgIGVudHJ5X3JlZjogZW50cnlSZWYsXG4gICAgICAgIHByb2dyZXNzOiBwcm9ncmVzcyxcbiAgICAgICAgY2lkOiB2aWV3LnRhcmdldENvbXBvbmVudElEKGZpbGVFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgICB9LCBvblJlcGx5KVxuICAgIH0pXG4gIH1cblxuICBwdXNoSW5wdXQoaW5wdXRFbCwgdGFyZ2V0Q3R4LCBmb3JjZUNpZCwgcGh4RXZlbnQsIG9wdHMsIGNhbGxiYWNrKXtcbiAgICBsZXQgdXBsb2Fkc1xuICAgIGxldCBjaWQgPSBpc0NpZChmb3JjZUNpZCkgPyBmb3JjZUNpZCA6IHRoaXMudGFyZ2V0Q29tcG9uZW50SUQoaW5wdXRFbC5mb3JtLCB0YXJnZXRDdHgpXG4gICAgbGV0IHJlZkdlbmVyYXRvciA9ICgpID0+IHRoaXMucHV0UmVmKFtpbnB1dEVsLCBpbnB1dEVsLmZvcm1dLCBcImNoYW5nZVwiLCBvcHRzKVxuICAgIGxldCBmb3JtRGF0YVxuICAgIGlmKGlucHV0RWwuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhcImNoYW5nZVwiKSkpe1xuICAgICAgZm9ybURhdGEgPSBzZXJpYWxpemVGb3JtKGlucHV0RWwuZm9ybSwge190YXJnZXQ6IG9wdHMuX3RhcmdldH0sIFtpbnB1dEVsLm5hbWVdKVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oaW5wdXRFbC5mb3JtLCB7X3RhcmdldDogb3B0cy5fdGFyZ2V0fSlcbiAgICB9XG4gICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5maWxlcyAmJiBpbnB1dEVsLmZpbGVzLmxlbmd0aCA+IDApe1xuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXMoaW5wdXRFbCwgQXJyYXkuZnJvbShpbnB1dEVsLmZpbGVzKSlcbiAgICB9XG4gICAgdXBsb2FkcyA9IExpdmVVcGxvYWRlci5zZXJpYWxpemVVcGxvYWRzKGlucHV0RWwpXG4gICAgbGV0IGV2ZW50ID0ge1xuICAgICAgdHlwZTogXCJmb3JtXCIsXG4gICAgICBldmVudDogcGh4RXZlbnQsXG4gICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICB1cGxvYWRzOiB1cGxvYWRzLFxuICAgICAgY2lkOiBjaWRcbiAgICB9XG4gICAgdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbmVyYXRvciwgXCJldmVudFwiLCBldmVudCwgcmVzcCA9PiB7XG4gICAgICBET00uc2hvd0Vycm9yKGlucHV0RWwsIHRoaXMubGl2ZVNvY2tldC5iaW5kaW5nKFBIWF9GRUVEQkFDS19GT1IpKVxuICAgICAgaWYoRE9NLmlzVXBsb2FkSW5wdXQoaW5wdXRFbCkgJiYgaW5wdXRFbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXBoeC1hdXRvLXVwbG9hZFwiKSAhPT0gbnVsbCl7XG4gICAgICAgIGlmKExpdmVVcGxvYWRlci5maWxlc0F3YWl0aW5nUHJlZmxpZ2h0KGlucHV0RWwpLmxlbmd0aCA+IDApe1xuICAgICAgICAgIGxldCBbcmVmLCBfZWxzXSA9IHJlZkdlbmVyYXRvcigpXG4gICAgICAgICAgdGhpcy51cGxvYWRGaWxlcyhpbnB1dEVsLmZvcm0sIHRhcmdldEN0eCwgcmVmLCBjaWQsIChfdXBsb2FkcykgPT4ge1xuICAgICAgICAgICAgY2FsbGJhY2sgJiYgY2FsbGJhY2socmVzcClcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckF3YWl0aW5nU3VibWl0KGlucHV0RWwuZm9ybSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhyZXNwKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmlnZ2VyQXdhaXRpbmdTdWJtaXQoZm9ybUVsKXtcbiAgICBsZXQgYXdhaXRpbmdTdWJtaXQgPSB0aGlzLmdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpXG4gICAgaWYoYXdhaXRpbmdTdWJtaXQpe1xuICAgICAgbGV0IFtfZWwsIF9yZWYsIF9vcHRzLCBjYWxsYmFja10gPSBhd2FpdGluZ1N1Ym1pdFxuICAgICAgdGhpcy5jYW5jZWxTdWJtaXQoZm9ybUVsKVxuICAgICAgY2FsbGJhY2soKVxuICAgIH1cbiAgfVxuXG4gIGdldFNjaGVkdWxlZFN1Ym1pdChmb3JtRWwpe1xuICAgIHJldHVybiB0aGlzLmZvcm1TdWJtaXRzLmZpbmQoKFtlbCwgX3JlZiwgX29wdHMsIF9jYWxsYmFja10pID0+IGVsLmlzU2FtZU5vZGUoZm9ybUVsKSlcbiAgfVxuXG4gIHNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBjYWxsYmFjayl7XG4gICAgaWYodGhpcy5nZXRTY2hlZHVsZWRTdWJtaXQoZm9ybUVsKSl7IHJldHVybiB0cnVlIH1cbiAgICB0aGlzLmZvcm1TdWJtaXRzLnB1c2goW2Zvcm1FbCwgcmVmLCBvcHRzLCBjYWxsYmFja10pXG4gIH1cblxuICBjYW5jZWxTdWJtaXQoZm9ybUVsKXtcbiAgICB0aGlzLmZvcm1TdWJtaXRzID0gdGhpcy5mb3JtU3VibWl0cy5maWx0ZXIoKFtlbCwgcmVmLCBfY2FsbGJhY2tdKSA9PiB7XG4gICAgICBpZihlbC5pc1NhbWVOb2RlKGZvcm1FbCkpe1xuICAgICAgICB0aGlzLnVuZG9SZWZzKHJlZilcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwdXNoRm9ybVN1Ym1pdChmb3JtRWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMsIG9uUmVwbHkpe1xuICAgIGxldCBmaWx0ZXJJZ25vcmVkID0gZWwgPT4ge1xuICAgICAgbGV0IHVzZXJJZ25vcmVkID0gY2xvc2VzdFBoeEJpbmRpbmcoZWwsIGAke3RoaXMuYmluZGluZyhQSFhfVVBEQVRFKX09aWdub3JlYCwgZWwuZm9ybSlcbiAgICAgIHJldHVybiAhKHVzZXJJZ25vcmVkIHx8IGNsb3Nlc3RQaHhCaW5kaW5nKGVsLCBcImRhdGEtcGh4LXVwZGF0ZT1pZ25vcmVcIiwgZWwuZm9ybSkpXG4gICAgfVxuICAgIGxldCBmaWx0ZXJEaXNhYmxlcyA9IGVsID0+IHtcbiAgICAgIHJldHVybiBlbC5oYXNBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFBIWF9ESVNBQkxFX1dJVEgpKVxuICAgIH1cbiAgICBsZXQgZmlsdGVyQnV0dG9uID0gZWwgPT4gZWwudGFnTmFtZSA9PSBcIkJVVFRPTlwiXG5cbiAgICBsZXQgZmlsdGVySW5wdXQgPSBlbCA9PiBbXCJJTlBVVFwiLCBcIlRFWFRBUkVBXCIsIFwiU0VMRUNUXCJdLmluY2x1ZGVzKGVsLnRhZ05hbWUpXG5cbiAgICBsZXQgcmVmR2VuZXJhdG9yID0gKCkgPT4ge1xuICAgICAgbGV0IGZvcm1FbGVtZW50cyA9IEFycmF5LmZyb20oZm9ybUVsLmVsZW1lbnRzKVxuICAgICAgbGV0IGRpc2FibGVzID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJEaXNhYmxlcylcbiAgICAgIGxldCBidXR0b25zID0gZm9ybUVsZW1lbnRzLmZpbHRlcihmaWx0ZXJCdXR0b24pLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuICAgICAgbGV0IGlucHV0cyA9IGZvcm1FbGVtZW50cy5maWx0ZXIoZmlsdGVySW5wdXQpLmZpbHRlcihmaWx0ZXJJZ25vcmVkKVxuXG4gICAgICBidXR0b25zLmZvckVhY2goYnV0dG9uID0+IHtcbiAgICAgICAgYnV0dG9uLnNldEF0dHJpYnV0ZShQSFhfRElTQUJMRUQsIGJ1dHRvbi5kaXNhYmxlZClcbiAgICAgICAgYnV0dG9uLmRpc2FibGVkID0gdHJ1ZVxuICAgICAgfSlcbiAgICAgIGlucHV0cy5mb3JFYWNoKGlucHV0ID0+IHtcbiAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9SRUFET05MWSwgaW5wdXQucmVhZE9ubHkpXG4gICAgICAgIGlucHV0LnJlYWRPbmx5ID0gdHJ1ZVxuICAgICAgICBpZihpbnB1dC5maWxlcyl7XG4gICAgICAgICAgaW5wdXQuc2V0QXR0cmlidXRlKFBIWF9ESVNBQkxFRCwgaW5wdXQuZGlzYWJsZWQpXG4gICAgICAgICAgaW5wdXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICBmb3JtRWwuc2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfUEFHRV9MT0FESU5HKSwgXCJcIilcbiAgICAgIHJldHVybiB0aGlzLnB1dFJlZihbZm9ybUVsXS5jb25jYXQoZGlzYWJsZXMpLmNvbmNhdChidXR0b25zKS5jb25jYXQoaW5wdXRzKSwgXCJzdWJtaXRcIiwgb3B0cylcbiAgICB9XG5cbiAgICBsZXQgY2lkID0gdGhpcy50YXJnZXRDb21wb25lbnRJRChmb3JtRWwsIHRhcmdldEN0eClcbiAgICBpZihMaXZlVXBsb2FkZXIuaGFzVXBsb2Fkc0luUHJvZ3Jlc3MoZm9ybUVsKSl7XG4gICAgICBsZXQgW3JlZiwgX2Vsc10gPSByZWZHZW5lcmF0b3IoKVxuICAgICAgbGV0IHB1c2ggPSAoKSA9PiB0aGlzLnB1c2hGb3JtU3VibWl0KGZvcm1FbCwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgb25SZXBseSlcbiAgICAgIHJldHVybiB0aGlzLnNjaGVkdWxlU3VibWl0KGZvcm1FbCwgcmVmLCBvcHRzLCBwdXNoKVxuICAgIH0gZWxzZSBpZihMaXZlVXBsb2FkZXIuaW5wdXRzQXdhaXRpbmdQcmVmbGlnaHQoZm9ybUVsKS5sZW5ndGggPiAwKXtcbiAgICAgIGxldCBbcmVmLCBlbHNdID0gcmVmR2VuZXJhdG9yKClcbiAgICAgIGxldCBwcm94eVJlZkdlbiA9ICgpID0+IFtyZWYsIGVscywgb3B0c11cbiAgICAgIHRoaXMudXBsb2FkRmlsZXMoZm9ybUVsLCB0YXJnZXRDdHgsIHJlZiwgY2lkLCAoX3VwbG9hZHMpID0+IHtcbiAgICAgICAgbGV0IGZvcm1EYXRhID0gc2VyaWFsaXplRm9ybShmb3JtRWwsIHt9KVxuICAgICAgICB0aGlzLnB1c2hXaXRoUmVwbHkocHJveHlSZWZHZW4sIFwiZXZlbnRcIiwge1xuICAgICAgICAgIHR5cGU6IFwiZm9ybVwiLFxuICAgICAgICAgIGV2ZW50OiBwaHhFdmVudCxcbiAgICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgICAgY2lkOiBjaWRcbiAgICAgICAgfSwgb25SZXBseSlcbiAgICAgIH0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBmb3JtRGF0YSA9IHNlcmlhbGl6ZUZvcm0oZm9ybUVsLCB7fSlcbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShyZWZHZW5lcmF0b3IsIFwiZXZlbnRcIiwge1xuICAgICAgICB0eXBlOiBcImZvcm1cIixcbiAgICAgICAgZXZlbnQ6IHBoeEV2ZW50LFxuICAgICAgICB2YWx1ZTogZm9ybURhdGEsXG4gICAgICAgIGNpZDogY2lkXG4gICAgICB9LCBvblJlcGx5KVxuICAgIH1cbiAgfVxuXG4gIHVwbG9hZEZpbGVzKGZvcm1FbCwgdGFyZ2V0Q3R4LCByZWYsIGNpZCwgb25Db21wbGV0ZSl7XG4gICAgbGV0IGpvaW5Db3VudEF0VXBsb2FkID0gdGhpcy5qb2luQ291bnRcbiAgICBsZXQgaW5wdXRFbHMgPSBMaXZlVXBsb2FkZXIuYWN0aXZlRmlsZUlucHV0cyhmb3JtRWwpXG4gICAgbGV0IG51bUZpbGVJbnB1dHNJblByb2dyZXNzID0gaW5wdXRFbHMubGVuZ3RoXG5cbiAgICAvLyBnZXQgZWFjaCBmaWxlIGlucHV0XG4gICAgaW5wdXRFbHMuZm9yRWFjaChpbnB1dEVsID0+IHtcbiAgICAgIGxldCB1cGxvYWRlciA9IG5ldyBMaXZlVXBsb2FkZXIoaW5wdXRFbCwgdGhpcywgKCkgPT4ge1xuICAgICAgICBudW1GaWxlSW5wdXRzSW5Qcm9ncmVzcy0tXG4gICAgICAgIGlmKG51bUZpbGVJbnB1dHNJblByb2dyZXNzID09PSAwKXsgb25Db21wbGV0ZSgpIH1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLnVwbG9hZGVyc1tpbnB1dEVsXSA9IHVwbG9hZGVyXG4gICAgICBsZXQgZW50cmllcyA9IHVwbG9hZGVyLmVudHJpZXMoKS5tYXAoZW50cnkgPT4gZW50cnkudG9QcmVmbGlnaHRQYXlsb2FkKCkpXG5cbiAgICAgIGxldCBwYXlsb2FkID0ge1xuICAgICAgICByZWY6IGlucHV0RWwuZ2V0QXR0cmlidXRlKFBIWF9VUExPQURfUkVGKSxcbiAgICAgICAgZW50cmllczogZW50cmllcyxcbiAgICAgICAgY2lkOiB0aGlzLnRhcmdldENvbXBvbmVudElEKGlucHV0RWwuZm9ybSwgdGFyZ2V0Q3R4KVxuICAgICAgfVxuXG4gICAgICB0aGlzLmxvZyhcInVwbG9hZFwiLCAoKSA9PiBbXCJzZW5kaW5nIHByZWZsaWdodCByZXF1ZXN0XCIsIHBheWxvYWRdKVxuXG4gICAgICB0aGlzLnB1c2hXaXRoUmVwbHkobnVsbCwgXCJhbGxvd191cGxvYWRcIiwgcGF5bG9hZCwgcmVzcCA9PiB7XG4gICAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtcImdvdCBwcmVmbGlnaHQgcmVzcG9uc2VcIiwgcmVzcF0pXG4gICAgICAgIGlmKHJlc3AuZXJyb3Ipe1xuICAgICAgICAgIHRoaXMudW5kb1JlZnMocmVmKVxuICAgICAgICAgIGxldCBbZW50cnlfcmVmLCByZWFzb25dID0gcmVzcC5lcnJvclxuICAgICAgICAgIHRoaXMubG9nKFwidXBsb2FkXCIsICgpID0+IFtgZXJyb3IgZm9yIGVudHJ5ICR7ZW50cnlfcmVmfWAsIHJlYXNvbl0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbGV0IG9uRXJyb3IgPSAoY2FsbGJhY2spID0+IHtcbiAgICAgICAgICAgIHRoaXMuY2hhbm5lbC5vbkVycm9yKCgpID0+IHtcbiAgICAgICAgICAgICAgaWYodGhpcy5qb2luQ291bnQgPT09IGpvaW5Db3VudEF0VXBsb2FkKXsgY2FsbGJhY2soKSB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgICB1cGxvYWRlci5pbml0QWRhcHRlclVwbG9hZChyZXNwLCBvbkVycm9yLCB0aGlzLmxpdmVTb2NrZXQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIGRpc3BhdGNoVXBsb2FkcyhuYW1lLCBmaWxlc09yQmxvYnMpe1xuICAgIGxldCBpbnB1dHMgPSBET00uZmluZFVwbG9hZElucHV0cyh0aGlzLmVsKS5maWx0ZXIoZWwgPT4gZWwubmFtZSA9PT0gbmFtZSlcbiAgICBpZihpbnB1dHMubGVuZ3RoID09PSAwKXsgbG9nRXJyb3IoYG5vIGxpdmUgZmlsZSBpbnB1dHMgZm91bmQgbWF0Y2hpbmcgdGhlIG5hbWUgXCIke25hbWV9XCJgKSB9XG4gICAgZWxzZSBpZihpbnB1dHMubGVuZ3RoID4gMSl7IGxvZ0Vycm9yKGBkdXBsaWNhdGUgbGl2ZSBmaWxlIGlucHV0cyBmb3VuZCBtYXRjaGluZyB0aGUgbmFtZSBcIiR7bmFtZX1cImApIH1cbiAgICBlbHNlIHsgRE9NLmRpc3BhdGNoRXZlbnQoaW5wdXRzWzBdLCBQSFhfVFJBQ0tfVVBMT0FEUywge2RldGFpbDoge2ZpbGVzOiBmaWxlc09yQmxvYnN9fSkgfVxuICB9XG5cbiAgcHVzaEZvcm1SZWNvdmVyeShmb3JtLCBuZXdDaWQsIGNhbGxiYWNrKXtcbiAgICB0aGlzLmxpdmVTb2NrZXQud2l0aGluT3duZXJzKGZvcm0sICh2aWV3LCB0YXJnZXRDdHgpID0+IHtcbiAgICAgIGxldCBpbnB1dCA9IGZvcm0uZWxlbWVudHNbMF1cbiAgICAgIGxldCBwaHhFdmVudCA9IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfQVVUT19SRUNPVkVSKSkgfHwgZm9ybS5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwiY2hhbmdlXCIpKVxuXG4gICAgICBKUy5leGVjKFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogaW5wdXQubmFtZSwgbmV3Q2lkOiBuZXdDaWQsIGNhbGxiYWNrOiBjYWxsYmFja31dKVxuICAgIH0pXG4gIH1cblxuICBwdXNoTGlua1BhdGNoKGhyZWYsIHRhcmdldEVsLCBjYWxsYmFjayl7XG4gICAgbGV0IGxpbmtSZWYgPSB0aGlzLmxpdmVTb2NrZXQuc2V0UGVuZGluZ0xpbmsoaHJlZilcbiAgICBsZXQgcmVmR2VuID0gdGFyZ2V0RWwgPyAoKSA9PiB0aGlzLnB1dFJlZihbdGFyZ2V0RWxdLCBcImNsaWNrXCIpIDogbnVsbFxuICAgIGxldCBmYWxsYmFjayA9ICgpID0+IHRoaXMubGl2ZVNvY2tldC5yZWRpcmVjdCh3aW5kb3cubG9jYXRpb24uaHJlZilcblxuICAgIGxldCBwdXNoID0gdGhpcy5wdXNoV2l0aFJlcGx5KHJlZkdlbiwgXCJsaXZlX3BhdGNoXCIsIHt1cmw6IGhyZWZ9LCByZXNwID0+IHtcbiAgICAgIHRoaXMubGl2ZVNvY2tldC5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYocmVzcC5saW5rX3JlZGlyZWN0KXtcbiAgICAgICAgICB0aGlzLmxpdmVTb2NrZXQucmVwbGFjZU1haW4oaHJlZiwgbnVsbCwgY2FsbGJhY2ssIGxpbmtSZWYpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYodGhpcy5saXZlU29ja2V0LmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXtcbiAgICAgICAgICAgIHRoaXMuaHJlZiA9IGhyZWZcbiAgICAgICAgICB9XG4gICAgICAgICAgdGhpcy5hcHBseVBlbmRpbmdVcGRhdGVzKClcbiAgICAgICAgICBjYWxsYmFjayAmJiBjYWxsYmFjayhsaW5rUmVmKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pXG5cbiAgICBpZihwdXNoKXtcbiAgICAgIHB1c2gucmVjZWl2ZShcInRpbWVvdXRcIiwgZmFsbGJhY2spXG4gICAgfSBlbHNlIHtcbiAgICAgIGZhbGxiYWNrKClcbiAgICB9XG4gIH1cblxuICBmb3Jtc0ZvclJlY292ZXJ5KGh0bWwpe1xuICAgIGlmKHRoaXMuam9pbkNvdW50ID09PSAwKXsgcmV0dXJuIFtdIH1cblxuICAgIGxldCBwaHhDaGFuZ2UgPSB0aGlzLmJpbmRpbmcoXCJjaGFuZ2VcIilcbiAgICBsZXQgdGVtcGxhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidGVtcGxhdGVcIilcbiAgICB0ZW1wbGF0ZS5pbm5lckhUTUwgPSBodG1sXG5cbiAgICByZXR1cm4gKFxuICAgICAgRE9NLmFsbCh0aGlzLmVsLCBgZm9ybVske3BoeENoYW5nZX1dYClcbiAgICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uaWQgJiYgdGhpcy5vd25zRWxlbWVudChmb3JtKSlcbiAgICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZWxlbWVudHMubGVuZ3RoID4gMClcbiAgICAgICAgLmZpbHRlcihmb3JtID0+IGZvcm0uZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfQVVUT19SRUNPVkVSKSkgIT09IFwiaWdub3JlXCIpXG4gICAgICAgIC5tYXAoZm9ybSA9PiB7XG4gICAgICAgICAgbGV0IG5ld0Zvcm0gPSB0ZW1wbGF0ZS5jb250ZW50LnF1ZXJ5U2VsZWN0b3IoYGZvcm1baWQ9XCIke2Zvcm0uaWR9XCJdWyR7cGh4Q2hhbmdlfT1cIiR7Zm9ybS5nZXRBdHRyaWJ1dGUocGh4Q2hhbmdlKX1cIl1gKVxuICAgICAgICAgIGlmKG5ld0Zvcm0pe1xuICAgICAgICAgICAgcmV0dXJuIFtmb3JtLCBuZXdGb3JtLCB0aGlzLnRhcmdldENvbXBvbmVudElEKG5ld0Zvcm0pXVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gW2Zvcm0sIG51bGwsIG51bGxdXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKChbZm9ybSwgbmV3Rm9ybSwgbmV3Q2lkXSkgPT4gbmV3Rm9ybSlcbiAgICApXG4gIH1cblxuICBtYXliZVB1c2hDb21wb25lbnRzRGVzdHJveWVkKGRlc3Ryb3llZENJRHMpe1xuICAgIGxldCB3aWxsRGVzdHJveUNJRHMgPSBkZXN0cm95ZWRDSURzLmZpbHRlcihjaWQgPT4ge1xuICAgICAgcmV0dXJuIERPTS5maW5kQ29tcG9uZW50Tm9kZUxpc3QodGhpcy5lbCwgY2lkKS5sZW5ndGggPT09IDBcbiAgICB9KVxuICAgIGlmKHdpbGxEZXN0cm95Q0lEcy5sZW5ndGggPiAwKXtcbiAgICAgIHRoaXMucHJ1bmluZ0NJRHMucHVzaCguLi53aWxsRGVzdHJveUNJRHMpXG5cbiAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfd2lsbF9kZXN0cm95XCIsIHtjaWRzOiB3aWxsRGVzdHJveUNJRHN9LCAoKSA9PiB7XG4gICAgICAgIC8vIFRoZSBjaWRzIGFyZSBlaXRoZXIgYmFjayBvbiB0aGUgcGFnZSBvciB0aGV5IHdpbGwgYmUgZnVsbHkgcmVtb3ZlZCxcbiAgICAgICAgLy8gc28gd2UgY2FuIHJlbW92ZSB0aGVtIGZyb20gdGhlIHBydW5pbmdDSURzLlxuICAgICAgICB0aGlzLnBydW5pbmdDSURzID0gdGhpcy5wcnVuaW5nQ0lEcy5maWx0ZXIoY2lkID0+IHdpbGxEZXN0cm95Q0lEcy5pbmRleE9mKGNpZCkgIT09IC0xKVxuXG4gICAgICAgIC8vIFNlZSBpZiBhbnkgb2YgdGhlIGNpZHMgd2Ugd2FudGVkIHRvIGRlc3Ryb3kgd2VyZSBhZGRlZCBiYWNrLFxuICAgICAgICAvLyBpZiB0aGV5IHdlcmUgYWRkZWQgYmFjaywgd2UgZG9uJ3QgYWN0dWFsbHkgZGVzdHJveSB0aGVtLlxuICAgICAgICBsZXQgY29tcGxldGVseURlc3Ryb3lDSURzID0gd2lsbERlc3Ryb3lDSURzLmZpbHRlcihjaWQgPT4ge1xuICAgICAgICAgIHJldHVybiBET00uZmluZENvbXBvbmVudE5vZGVMaXN0KHRoaXMuZWwsIGNpZCkubGVuZ3RoID09PSAwXG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYoY29tcGxldGVseURlc3Ryb3lDSURzLmxlbmd0aCA+IDApe1xuICAgICAgICAgIHRoaXMucHVzaFdpdGhSZXBseShudWxsLCBcImNpZHNfZGVzdHJveWVkXCIsIHtjaWRzOiBjb21wbGV0ZWx5RGVzdHJveUNJRHN9LCAocmVzcCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZW5kZXJlZC5wcnVuZUNJRHMocmVzcC5jaWRzKVxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgb3duc0VsZW1lbnQoZWwpe1xuICAgIHJldHVybiBlbC5nZXRBdHRyaWJ1dGUoUEhYX1BBUkVOVF9JRCkgPT09IHRoaXMuaWQgfHxcbiAgICAgIG1heWJlKGVsLmNsb3Nlc3QoUEhYX1ZJRVdfU0VMRUNUT1IpLCBub2RlID0+IG5vZGUuaWQpID09PSB0aGlzLmlkXG4gIH1cblxuICBzdWJtaXRGb3JtKGZvcm0sIHRhcmdldEN0eCwgcGh4RXZlbnQsIG9wdHMgPSB7fSl7XG4gICAgRE9NLnB1dFByaXZhdGUoZm9ybSwgUEhYX0hBU19TVUJNSVRURUQsIHRydWUpXG4gICAgbGV0IHBoeEZlZWRiYWNrID0gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoUEhYX0ZFRURCQUNLX0ZPUilcbiAgICBsZXQgaW5wdXRzID0gQXJyYXkuZnJvbShmb3JtLmVsZW1lbnRzKVxuICAgIHRoaXMubGl2ZVNvY2tldC5ibHVyQWN0aXZlRWxlbWVudCh0aGlzKVxuICAgIHRoaXMucHVzaEZvcm1TdWJtaXQoZm9ybSwgdGFyZ2V0Q3R4LCBwaHhFdmVudCwgb3B0cywgKCkgPT4ge1xuICAgICAgaW5wdXRzLmZvckVhY2goaW5wdXQgPT4gRE9NLnNob3dFcnJvcihpbnB1dCwgcGh4RmVlZGJhY2spKVxuICAgICAgdGhpcy5saXZlU29ja2V0LnJlc3RvcmVQcmV2aW91c2x5QWN0aXZlRm9jdXMoKVxuICAgIH0pXG4gIH1cblxuICBiaW5kaW5nKGtpbmQpeyByZXR1cm4gdGhpcy5saXZlU29ja2V0LmJpbmRpbmcoa2luZCkgfVxufVxuIiwgIi8qKiBJbml0aWFsaXplcyB0aGUgTGl2ZVNvY2tldFxuICpcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gZW5kUG9pbnQgLSBUaGUgc3RyaW5nIFdlYlNvY2tldCBlbmRwb2ludCwgaWUsIGBcIndzczovL2V4YW1wbGUuY29tL2xpdmVcImAsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYFwiL2xpdmVcImAgKGluaGVyaXRlZCBob3N0ICYgcHJvdG9jb2wpXG4gKiBAcGFyYW0ge1Bob2VuaXguU29ja2V0fSBzb2NrZXQgLSB0aGUgcmVxdWlyZWQgUGhvZW5peCBTb2NrZXQgY2xhc3MgaW1wb3J0ZWQgZnJvbSBcInBob2VuaXhcIi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIGltcG9ydCB7U29ja2V0fSBmcm9tIFwicGhvZW5peFwiXG4gKiAgICAgaW1wb3J0IHtMaXZlU29ja2V0fSBmcm9tIFwicGhvZW5peF9saXZlX3ZpZXdcIlxuICogICAgIGxldCBsaXZlU29ja2V0ID0gbmV3IExpdmVTb2NrZXQoXCIvbGl2ZVwiLCBTb2NrZXQsIHsuLi59KVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0c10gLSBPcHRpb25hbCBjb25maWd1cmF0aW9uLiBPdXRzaWRlIG9mIGtleXMgbGlzdGVkIGJlbG93LCBhbGxcbiAqIGNvbmZpZ3VyYXRpb24gaXMgcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBQaG9lbml4IFNvY2tldCBjb25zdHJ1Y3Rvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5kZWZhdWx0c10gLSBUaGUgb3B0aW9uYWwgZGVmYXVsdHMgdG8gdXNlIGZvciB2YXJpb3VzIGJpbmRpbmdzLFxuICogc3VjaCBhcyBgcGh4LWRlYm91bmNlYC4gU3VwcG9ydHMgdGhlIGZvbGxvd2luZyBrZXlzOlxuICpcbiAqICAgLSBkZWJvdW5jZSAtIHRoZSBtaWxsaXNlY29uZCBwaHgtZGVib3VuY2UgdGltZS4gRGVmYXVsdHMgMzAwXG4gKiAgIC0gdGhyb3R0bGUgLSB0aGUgbWlsbGlzZWNvbmQgcGh4LXRocm90dGxlIHRpbWUuIERlZmF1bHRzIDMwMFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnBhcmFtc10gLSBUaGUgb3B0aW9uYWwgZnVuY3Rpb24gZm9yIHBhc3NpbmcgY29ubmVjdCBwYXJhbXMuXG4gKiBUaGUgZnVuY3Rpb24gcmVjZWl2ZXMgdGhlIGVsZW1lbnQgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gTGl2ZVZpZXcuIEZvciBleGFtcGxlOlxuICpcbiAqICAgICAoZWwpID0+IHt2aWV3OiBlbC5nZXRBdHRyaWJ1dGUoXCJkYXRhLW15LXZpZXctbmFtZVwiLCB0b2tlbjogd2luZG93Lm15VG9rZW59XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmJpbmRpbmdQcmVmaXhdIC0gVGhlIG9wdGlvbmFsIHByZWZpeCB0byB1c2UgZm9yIGFsbCBwaHggRE9NIGFubm90YXRpb25zLlxuICogRGVmYXVsdHMgdG8gXCJwaHgtXCIuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMuaG9va3NdIC0gVGhlIG9wdGlvbmFsIG9iamVjdCBmb3IgcmVmZXJlbmNpbmcgTGl2ZVZpZXcgaG9vayBjYWxsYmFja3MuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdHMudXBsb2FkZXJzXSAtIFRoZSBvcHRpb25hbCBvYmplY3QgZm9yIHJlZmVyZW5jaW5nIExpdmVWaWV3IHVwbG9hZGVyIGNhbGxiYWNrcy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubG9hZGVyVGltZW91dF0gLSBUaGUgb3B0aW9uYWwgZGVsYXkgaW4gbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGFwcGx5XG4gKiBsb2FkaW5nIHN0YXRlcy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMubWF4UmVsb2Fkc10gLSBUaGUgbWF4aW11bSByZWxvYWRzIGJlZm9yZSBlbnRlcmluZyBmYWlsc2FmZSBtb2RlLlxuICogQHBhcmFtIHtpbnRlZ2VyfSBbb3B0cy5yZWxvYWRKaXR0ZXJNaW5dIC0gVGhlIG1pbmltdW0gdGltZSBiZXR3ZWVuIG5vcm1hbCByZWxvYWQgYXR0ZW1wdHMuXG4gKiBAcGFyYW0ge2ludGVnZXJ9IFtvcHRzLnJlbG9hZEppdHRlck1heF0gLSBUaGUgbWF4aW11bSB0aW1lIGJldHdlZW4gbm9ybWFsIHJlbG9hZCBhdHRlbXB0cy5cbiAqIEBwYXJhbSB7aW50ZWdlcn0gW29wdHMuZmFpbHNhZmVKaXR0ZXJdIC0gVGhlIHRpbWUgYmV0d2VlbiByZWxvYWQgYXR0ZW1wdHMgaW4gZmFpbHNhZmUgbW9kZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRzLnZpZXdMb2dnZXJdIC0gVGhlIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGxvZyBkZWJ1ZyBpbmZvcm1hdGlvbi4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgICh2aWV3LCBraW5kLCBtc2csIG9iaikgPT4gY29uc29sZS5sb2coYCR7dmlldy5pZH0gJHtraW5kfTogJHttc2d9IC0gYCwgb2JqKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5tZXRhZGF0YV0gLSBUaGUgb3B0aW9uYWwgb2JqZWN0IG1hcHBpbmcgZXZlbnQgbmFtZXMgdG8gZnVuY3Rpb25zIGZvclxuICogcG9wdWxhdGluZyBldmVudCBtZXRhZGF0YS4gRm9yIGV4YW1wbGU6XG4gKlxuICogICAgIG1ldGFkYXRhOiB7XG4gKiAgICAgICBjbGljazogKGUsIGVsKSA9PiB7XG4gKiAgICAgICAgIHJldHVybiB7XG4gKiAgICAgICAgICAgY3RybEtleTogZS5jdHJsS2V5LFxuICogICAgICAgICAgIG1ldGFLZXk6IGUubWV0YUtleSxcbiAqICAgICAgICAgICBkZXRhaWw6IGUuZGV0YWlsIHx8IDEsXG4gKiAgICAgICAgIH1cbiAqICAgICAgIH0sXG4gKiAgICAgICBrZXlkb3duOiAoZSwgZWwpID0+IHtcbiAqICAgICAgICAgcmV0dXJuIHtcbiAqICAgICAgICAgICBrZXk6IGUua2V5LFxuICogICAgICAgICAgIGN0cmxLZXk6IGUuY3RybEtleSxcbiAqICAgICAgICAgICBtZXRhS2V5OiBlLm1ldGFLZXksXG4gKiAgICAgICAgICAgc2hpZnRLZXk6IGUuc2hpZnRLZXlcbiAqICAgICAgICAgfVxuICogICAgICAgfVxuICogICAgIH1cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0cy5zZXNzaW9uU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgd2hlbiBMaXZlVmlldyB3b24ndCBoYXZlIGFjY2VzcyB0byBgc2Vzc2lvblN0b3JhZ2VgLiAgRm9yIGV4YW1wbGUsIFRoaXMgY291bGRcbiAqIGhhcHBlbiBpZiBhIHNpdGUgbG9hZHMgYSBjcm9zcy1kb21haW4gTGl2ZVZpZXcgaW4gYW4gaWZyYW1lLiAgRXhhbXBsZSB1c2FnZTpcbiAqXG4gKiAgICAgY2xhc3MgSW5NZW1vcnlTdG9yYWdlIHtcbiAqICAgICAgIGNvbnN0cnVjdG9yKCkgeyB0aGlzLnN0b3JhZ2UgPSB7fSB9XG4gKiAgICAgICBnZXRJdGVtKGtleU5hbWUpIHsgcmV0dXJuIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB9XG4gKiAgICAgICByZW1vdmVJdGVtKGtleU5hbWUpIHsgZGVsZXRlIHRoaXMuc3RvcmFnZVtrZXlOYW1lXSB9XG4gKiAgICAgICBzZXRJdGVtKGtleU5hbWUsIGtleVZhbHVlKSB7IHRoaXMuc3RvcmFnZVtrZXlOYW1lXSA9IGtleVZhbHVlIH1cbiAqICAgICB9XG4gKlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRzLmxvY2FsU3RvcmFnZV0gLSBBbiBvcHRpb25hbCBTdG9yYWdlIGNvbXBhdGlibGUgb2JqZWN0XG4gKiBVc2VmdWwgZm9yIHdoZW4gTGl2ZVZpZXcgd29uJ3QgaGF2ZSBhY2Nlc3MgdG8gYGxvY2FsU3RvcmFnZWAuXG4gKiBTZWUgYG9wdHMuc2Vzc2lvblN0b3JhZ2VgIGZvciBleGFtcGxlcy5cbiovXG5cbmltcG9ydCB7XG4gIEJJTkRJTkdfUFJFRklYLFxuICBDT05TRUNVVElWRV9SRUxPQURTLFxuICBERUZBVUxUUyxcbiAgRkFJTFNBRkVfSklUVEVSLFxuICBMT0FERVJfVElNRU9VVCxcbiAgTUFYX1JFTE9BRFMsXG4gIFBIWF9ERUJPVU5DRSxcbiAgUEhYX0RST1BfVEFSR0VULFxuICBQSFhfSEFTX0ZPQ1VTRUQsXG4gIFBIWF9LRVksXG4gIFBIWF9MSU5LX1NUQVRFLFxuICBQSFhfTElWRV9MSU5LLFxuICBQSFhfTFZfREVCVUcsXG4gIFBIWF9MVl9MQVRFTkNZX1NJTSxcbiAgUEhYX0xWX1BST0ZJTEUsXG4gIFBIWF9NQUlOLFxuICBQSFhfUEFSRU5UX0lELFxuICBQSFhfVklFV19TRUxFQ1RPUixcbiAgUEhYX1JPT1RfSUQsXG4gIFBIWF9USFJPVFRMRSxcbiAgUEhYX1RSQUNLX1VQTE9BRFMsXG4gIFBIWF9TRVNTSU9OLFxuICBSRUxPQURfSklUVEVSX01JTixcbiAgUkVMT0FEX0pJVFRFUl9NQVgsXG59IGZyb20gXCIuL2NvbnN0YW50c1wiXG5cbmltcG9ydCB7XG4gIGNsb25lLFxuICBjbG9zZXN0UGh4QmluZGluZyxcbiAgY2xvc3VyZSxcbiAgZGVidWcsXG4gIGlzT2JqZWN0LFxuICBtYXliZVxufSBmcm9tIFwiLi91dGlsc1wiXG5cbmltcG9ydCBCcm93c2VyIGZyb20gXCIuL2Jyb3dzZXJcIlxuaW1wb3J0IERPTSBmcm9tIFwiLi9kb21cIlxuaW1wb3J0IEhvb2tzIGZyb20gXCIuL2hvb2tzXCJcbmltcG9ydCBMaXZlVXBsb2FkZXIgZnJvbSBcIi4vbGl2ZV91cGxvYWRlclwiXG5pbXBvcnQgVmlldyBmcm9tIFwiLi92aWV3XCJcbmltcG9ydCBKUyBmcm9tIFwiLi9qc1wiXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpdmVTb2NrZXQge1xuICBjb25zdHJ1Y3Rvcih1cmwsIHBoeFNvY2tldCwgb3B0cyA9IHt9KXtcbiAgICB0aGlzLnVubG9hZGVkID0gZmFsc2VcbiAgICBpZighcGh4U29ja2V0IHx8IHBoeFNvY2tldC5jb25zdHJ1Y3Rvci5uYW1lID09PSBcIk9iamVjdFwiKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgXG4gICAgICBhIHBob2VuaXggU29ja2V0IG11c3QgYmUgcHJvdmlkZWQgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB0byB0aGUgTGl2ZVNvY2tldCBjb25zdHJ1Y3Rvci4gRm9yIGV4YW1wbGU6XG5cbiAgICAgICAgICBpbXBvcnQge1NvY2tldH0gZnJvbSBcInBob2VuaXhcIlxuICAgICAgICAgIGltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbiAgICAgICAgICBsZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7Li4ufSlcbiAgICAgIGApXG4gICAgfVxuICAgIHRoaXMuc29ja2V0ID0gbmV3IHBoeFNvY2tldCh1cmwsIG9wdHMpXG4gICAgdGhpcy5iaW5kaW5nUHJlZml4ID0gb3B0cy5iaW5kaW5nUHJlZml4IHx8IEJJTkRJTkdfUFJFRklYXG4gICAgdGhpcy5vcHRzID0gb3B0c1xuICAgIHRoaXMucGFyYW1zID0gY2xvc3VyZShvcHRzLnBhcmFtcyB8fCB7fSlcbiAgICB0aGlzLnZpZXdMb2dnZXIgPSBvcHRzLnZpZXdMb2dnZXJcbiAgICB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzID0gb3B0cy5tZXRhZGF0YSB8fCB7fVxuICAgIHRoaXMuZGVmYXVsdHMgPSBPYmplY3QuYXNzaWduKGNsb25lKERFRkFVTFRTKSwgb3B0cy5kZWZhdWx0cyB8fCB7fSlcbiAgICB0aGlzLmFjdGl2ZUVsZW1lbnQgPSBudWxsXG4gICAgdGhpcy5wcmV2QWN0aXZlID0gbnVsbFxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgIHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBudWxsXG4gICAgdGhpcy5saW5rUmVmID0gMVxuICAgIHRoaXMucm9vdHMgPSB7fVxuICAgIHRoaXMuaHJlZiA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmXG4gICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICB0aGlzLmN1cnJlbnRMb2NhdGlvbiA9IGNsb25lKHdpbmRvdy5sb2NhdGlvbilcbiAgICB0aGlzLmhvb2tzID0gb3B0cy5ob29rcyB8fCB7fVxuICAgIHRoaXMudXBsb2FkZXJzID0gb3B0cy51cGxvYWRlcnMgfHwge31cbiAgICB0aGlzLmxvYWRlclRpbWVvdXQgPSBvcHRzLmxvYWRlclRpbWVvdXQgfHwgTE9BREVSX1RJTUVPVVRcbiAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lciA9IG51bGxcbiAgICB0aGlzLm1heFJlbG9hZHMgPSBvcHRzLm1heFJlbG9hZHMgfHwgTUFYX1JFTE9BRFNcbiAgICB0aGlzLnJlbG9hZEppdHRlck1pbiA9IG9wdHMucmVsb2FkSml0dGVyTWluIHx8IFJFTE9BRF9KSVRURVJfTUlOXG4gICAgdGhpcy5yZWxvYWRKaXR0ZXJNYXggPSBvcHRzLnJlbG9hZEppdHRlck1heCB8fCBSRUxPQURfSklUVEVSX01BWFxuICAgIHRoaXMuZmFpbHNhZmVKaXR0ZXIgPSBvcHRzLmZhaWxzYWZlSml0dGVyIHx8IEZBSUxTQUZFX0pJVFRFUlxuICAgIHRoaXMubG9jYWxTdG9yYWdlID0gb3B0cy5sb2NhbFN0b3JhZ2UgfHwgd2luZG93LmxvY2FsU3RvcmFnZVxuICAgIHRoaXMuc2Vzc2lvblN0b3JhZ2UgPSBvcHRzLnNlc3Npb25TdG9yYWdlIHx8IHdpbmRvdy5zZXNzaW9uU3RvcmFnZVxuICAgIHRoaXMuYm91bmRUb3BMZXZlbEV2ZW50cyA9IGZhbHNlXG4gICAgdGhpcy5kb21DYWxsYmFja3MgPSBPYmplY3QuYXNzaWduKHtvbk5vZGVBZGRlZDogY2xvc3VyZSgpLCBvbkJlZm9yZUVsVXBkYXRlZDogY2xvc3VyZSgpfSwgb3B0cy5kb20gfHwge30pXG4gICAgdGhpcy50cmFuc2l0aW9ucyA9IG5ldyBUcmFuc2l0aW9uU2V0KClcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBhZ2VoaWRlXCIsIF9lID0+IHtcbiAgICAgIHRoaXMudW5sb2FkZWQgPSB0cnVlXG4gICAgfSlcbiAgICB0aGlzLnNvY2tldC5vbk9wZW4oKCkgPT4ge1xuICAgICAgaWYodGhpcy5pc1VubG9hZGVkKCkpe1xuICAgICAgICAvLyByZWxvYWQgcGFnZSBpZiBiZWluZyByZXN0b3JlZCBmcm9tIGJhY2svZm9yd2FyZCBjYWNoZSBhbmQgYnJvd3NlciBkb2VzIG5vdCBlbWl0IFwicGFnZXNob3dcIlxuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgLy8gcHVibGljXG5cbiAgaXNQcm9maWxlRW5hYmxlZCgpeyByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9QUk9GSUxFKSA9PT0gXCJ0cnVlXCIgfVxuXG4gIGlzRGVidWdFbmFibGVkKCl7IHJldHVybiB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0RFQlVHKSA9PT0gXCJ0cnVlXCIgfVxuXG4gIGlzRGVidWdEaXNhYmxlZCgpeyByZXR1cm4gdGhpcy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKFBIWF9MVl9ERUJVRykgPT09IFwiZmFsc2VcIiB9XG5cbiAgZW5hYmxlRGVidWcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9ERUJVRywgXCJ0cnVlXCIpIH1cblxuICBlbmFibGVQcm9maWxpbmcoKXsgdGhpcy5zZXNzaW9uU3RvcmFnZS5zZXRJdGVtKFBIWF9MVl9QUk9GSUxFLCBcInRydWVcIikgfVxuXG4gIGRpc2FibGVEZWJ1ZygpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0RFQlVHLCBcImZhbHNlXCIpIH1cblxuICBkaXNhYmxlUHJvZmlsaW5nKCl7IHRoaXMuc2Vzc2lvblN0b3JhZ2UucmVtb3ZlSXRlbShQSFhfTFZfUFJPRklMRSkgfVxuXG4gIGVuYWJsZUxhdGVuY3lTaW0odXBwZXJCb3VuZE1zKXtcbiAgICB0aGlzLmVuYWJsZURlYnVnKClcbiAgICBjb25zb2xlLmxvZyhcImxhdGVuY3kgc2ltdWxhdG9yIGVuYWJsZWQgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGlzIGJyb3dzZXIgc2Vzc2lvbi4gQ2FsbCBkaXNhYmxlTGF0ZW5jeVNpbSgpIHRvIGRpc2FibGVcIilcbiAgICB0aGlzLnNlc3Npb25TdG9yYWdlLnNldEl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNLCB1cHBlckJvdW5kTXMpXG4gIH1cblxuICBkaXNhYmxlTGF0ZW5jeVNpbSgpeyB0aGlzLnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNKSB9XG5cbiAgZ2V0TGF0ZW5jeVNpbSgpe1xuICAgIGxldCBzdHIgPSB0aGlzLnNlc3Npb25TdG9yYWdlLmdldEl0ZW0oUEhYX0xWX0xBVEVOQ1lfU0lNKVxuICAgIHJldHVybiBzdHIgPyBwYXJzZUludChzdHIpIDogbnVsbFxuICB9XG5cbiAgZ2V0U29ja2V0KCl7IHJldHVybiB0aGlzLnNvY2tldCB9XG5cbiAgY29ubmVjdCgpe1xuICAgIC8vIGVuYWJsZSBkZWJ1ZyBieSBkZWZhdWx0IGlmIG9uIGxvY2FsaG9zdCBhbmQgbm90IGV4cGxpY2l0bHkgZGlzYWJsZWRcbiAgICBpZih3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUgPT09IFwibG9jYWxob3N0XCIgJiYgIXRoaXMuaXNEZWJ1Z0Rpc2FibGVkKCkpeyB0aGlzLmVuYWJsZURlYnVnKCkgfVxuICAgIGxldCBkb0Nvbm5lY3QgPSAoKSA9PiB7XG4gICAgICBpZih0aGlzLmpvaW5Sb290Vmlld3MoKSl7XG4gICAgICAgIHRoaXMuYmluZFRvcExldmVsRXZlbnRzKClcbiAgICAgICAgdGhpcy5zb2NrZXQuY29ubmVjdCgpXG4gICAgICB9IGVsc2UgaWYodGhpcy5tYWluKXtcbiAgICAgICAgdGhpcy5zb2NrZXQuY29ubmVjdCgpXG4gICAgICB9XG4gICAgfVxuICAgIGlmKFtcImNvbXBsZXRlXCIsIFwibG9hZGVkXCIsIFwiaW50ZXJhY3RpdmVcIl0uaW5kZXhPZihkb2N1bWVudC5yZWFkeVN0YXRlKSA+PSAwKXtcbiAgICAgIGRvQ29ubmVjdCgpXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IGRvQ29ubmVjdCgpKVxuICAgIH1cbiAgfVxuXG4gIGRpc2Nvbm5lY3QoY2FsbGJhY2spe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lcilcbiAgICB0aGlzLnNvY2tldC5kaXNjb25uZWN0KGNhbGxiYWNrKVxuICB9XG5cbiAgcmVwbGFjZVRyYW5zcG9ydCh0cmFuc3BvcnQpe1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJlbG9hZFdpdGhKaXR0ZXJUaW1lcilcbiAgICB0aGlzLnNvY2tldC5yZXBsYWNlVHJhbnNwb3J0KHRyYW5zcG9ydClcbiAgICB0aGlzLmNvbm5lY3QoKVxuICB9XG5cbiAgZXhlY0pTKGVsLCBlbmNvZGVkSlMsIGV2ZW50VHlwZSA9IG51bGwpe1xuICAgIHRoaXMub3duZXIoZWwsIHZpZXcgPT4gSlMuZXhlYyhldmVudFR5cGUsIGVuY29kZWRKUywgdmlldywgZWwpKVxuICB9XG5cbiAgLy8gcHJpdmF0ZVxuXG4gIHRyaWdnZXJET00oa2luZCwgYXJncyl7IHRoaXMuZG9tQ2FsbGJhY2tzW2tpbmRdKC4uLmFyZ3MpIH1cblxuICB0aW1lKG5hbWUsIGZ1bmMpe1xuICAgIGlmKCF0aGlzLmlzUHJvZmlsZUVuYWJsZWQoKSB8fCAhY29uc29sZS50aW1lKXsgcmV0dXJuIGZ1bmMoKSB9XG4gICAgY29uc29sZS50aW1lKG5hbWUpXG4gICAgbGV0IHJlc3VsdCA9IGZ1bmMoKVxuICAgIGNvbnNvbGUudGltZUVuZChuYW1lKVxuICAgIHJldHVybiByZXN1bHRcbiAgfVxuXG4gIGxvZyh2aWV3LCBraW5kLCBtc2dDYWxsYmFjayl7XG4gICAgaWYodGhpcy52aWV3TG9nZ2VyKXtcbiAgICAgIGxldCBbbXNnLCBvYmpdID0gbXNnQ2FsbGJhY2soKVxuICAgICAgdGhpcy52aWV3TG9nZ2VyKHZpZXcsIGtpbmQsIG1zZywgb2JqKVxuICAgIH0gZWxzZSBpZih0aGlzLmlzRGVidWdFbmFibGVkKCkpe1xuICAgICAgbGV0IFttc2csIG9ial0gPSBtc2dDYWxsYmFjaygpXG4gICAgICBkZWJ1Zyh2aWV3LCBraW5kLCBtc2csIG9iailcbiAgICB9XG4gIH1cblxuICByZXF1ZXN0RE9NVXBkYXRlKGNhbGxiYWNrKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFmdGVyKGNhbGxiYWNrKVxuICB9XG5cbiAgdHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUgPSBmdW5jdGlvbigpe30pe1xuICAgIHRoaXMudHJhbnNpdGlvbnMuYWRkVHJhbnNpdGlvbih0aW1lLCBvblN0YXJ0LCBvbkRvbmUpXG4gIH1cblxuICBvbkNoYW5uZWwoY2hhbm5lbCwgZXZlbnQsIGNiKXtcbiAgICBjaGFubmVsLm9uKGV2ZW50LCBkYXRhID0+IHtcbiAgICAgIGxldCBsYXRlbmN5ID0gdGhpcy5nZXRMYXRlbmN5U2ltKClcbiAgICAgIGlmKCFsYXRlbmN5KXtcbiAgICAgICAgY2IoZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBzaW11bGF0aW5nICR7bGF0ZW5jeX1tcyBvZiBsYXRlbmN5IGZyb20gc2VydmVyIHRvIGNsaWVudGApXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gY2IoZGF0YSksIGxhdGVuY3kpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIHdyYXBQdXNoKHZpZXcsIG9wdHMsIHB1c2gpe1xuICAgIGxldCBsYXRlbmN5ID0gdGhpcy5nZXRMYXRlbmN5U2ltKClcbiAgICBsZXQgb2xkSm9pbkNvdW50ID0gdmlldy5qb2luQ291bnRcbiAgICBpZighbGF0ZW5jeSl7XG4gICAgICBpZih0aGlzLmlzQ29ubmVjdGVkKCkgJiYgb3B0cy50aW1lb3V0KXtcbiAgICAgICAgcmV0dXJuIHB1c2goKS5yZWNlaXZlKFwidGltZW91dFwiLCAoKSA9PiB7XG4gICAgICAgICAgaWYodmlldy5qb2luQ291bnQgPT09IG9sZEpvaW5Db3VudCAmJiAhdmlldy5pc0Rlc3Ryb3llZCgpKXtcbiAgICAgICAgICAgIHRoaXMucmVsb2FkV2l0aEppdHRlcih2aWV3LCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMubG9nKHZpZXcsIFwidGltZW91dFwiLCAoKSA9PiBbXCJyZWNlaXZlZCB0aW1lb3V0IHdoaWxlIGNvbW11bmljYXRpbmcgd2l0aCBzZXJ2ZXIuIEZhbGxpbmcgYmFjayB0byBoYXJkIHJlZnJlc2ggZm9yIHJlY292ZXJ5XCJdKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcHVzaCgpXG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coYHNpbXVsYXRpbmcgJHtsYXRlbmN5fW1zIG9mIGxhdGVuY3kgZnJvbSBjbGllbnQgdG8gc2VydmVyYClcbiAgICBsZXQgZmFrZVB1c2ggPSB7XG4gICAgICByZWNlaXZlczogW10sXG4gICAgICByZWNlaXZlKGtpbmQsIGNiKXsgdGhpcy5yZWNlaXZlcy5wdXNoKFtraW5kLCBjYl0pIH1cbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBpZih2aWV3LmlzRGVzdHJveWVkKCkpeyByZXR1cm4gfVxuICAgICAgZmFrZVB1c2gucmVjZWl2ZXMucmVkdWNlKChhY2MsIFtraW5kLCBjYl0pID0+IGFjYy5yZWNlaXZlKGtpbmQsIGNiKSwgcHVzaCgpKVxuICAgIH0sIGxhdGVuY3kpXG4gICAgcmV0dXJuIGZha2VQdXNoXG4gIH1cblxuICByZWxvYWRXaXRoSml0dGVyKHZpZXcsIGxvZyl7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyKVxuICAgIHRoaXMuZGlzY29ubmVjdCgpXG4gICAgbGV0IG1pbk1zID0gdGhpcy5yZWxvYWRKaXR0ZXJNaW5cbiAgICBsZXQgbWF4TXMgPSB0aGlzLnJlbG9hZEppdHRlck1heFxuICAgIGxldCBhZnRlck1zID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heE1zIC0gbWluTXMgKyAxKSkgKyBtaW5Nc1xuICAgIGxldCB0cmllcyA9IEJyb3dzZXIudXBkYXRlTG9jYWwodGhpcy5sb2NhbFN0b3JhZ2UsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSwgQ09OU0VDVVRJVkVfUkVMT0FEUywgMCwgY291bnQgPT4gY291bnQgKyAxKVxuICAgIGlmKHRyaWVzID4gdGhpcy5tYXhSZWxvYWRzKXtcbiAgICAgIGFmdGVyTXMgPSB0aGlzLmZhaWxzYWZlSml0dGVyXG4gICAgfVxuICAgIHRoaXMucmVsb2FkV2l0aEppdHRlclRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAvLyBpZiB2aWV3IGhhcyByZWNvdmVyZWQsIHN1Y2ggYXMgdHJhbnNwb3J0IHJlcGxhY2VkLCB0aGVuIGNhbmNlbFxuICAgICAgaWYodmlldy5pc0Rlc3Ryb3llZCgpIHx8IHZpZXcuaXNDb25uZWN0ZWQoKSl7IHJldHVybiB9XG4gICAgICB2aWV3LmRlc3Ryb3koKVxuICAgICAgbG9nID8gbG9nKCkgOiB0aGlzLmxvZyh2aWV3LCBcImpvaW5cIiwgKCkgPT4gW2BlbmNvdW50ZXJlZCAke3RyaWVzfSBjb25zZWN1dGl2ZSByZWxvYWRzYF0pXG4gICAgICBpZih0cmllcyA+IHRoaXMubWF4UmVsb2Fkcyl7XG4gICAgICAgIHRoaXMubG9nKHZpZXcsIFwiam9pblwiLCAoKSA9PiBbYGV4Y2VlZGVkICR7dGhpcy5tYXhSZWxvYWRzfSBjb25zZWN1dGl2ZSByZWxvYWRzLiBFbnRlcmluZyBmYWlsc2FmZSBtb2RlYF0pXG4gICAgICB9XG4gICAgICBpZih0aGlzLmhhc1BlbmRpbmdMaW5rKCkpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24gPSB0aGlzLnBlbmRpbmdMaW5rXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKClcbiAgICAgIH1cbiAgICB9LCBhZnRlck1zKVxuICB9XG5cbiAgZ2V0SG9va0NhbGxiYWNrcyhuYW1lKXtcbiAgICByZXR1cm4gbmFtZSAmJiBuYW1lLnN0YXJ0c1dpdGgoXCJQaG9lbml4LlwiKSA/IEhvb2tzW25hbWUuc3BsaXQoXCIuXCIpWzFdXSA6IHRoaXMuaG9va3NbbmFtZV1cbiAgfVxuXG4gIGlzVW5sb2FkZWQoKXsgcmV0dXJuIHRoaXMudW5sb2FkZWQgfVxuXG4gIGlzQ29ubmVjdGVkKCl7IHJldHVybiB0aGlzLnNvY2tldC5pc0Nvbm5lY3RlZCgpIH1cblxuICBnZXRCaW5kaW5nUHJlZml4KCl7IHJldHVybiB0aGlzLmJpbmRpbmdQcmVmaXggfVxuXG4gIGJpbmRpbmcoa2luZCl7IHJldHVybiBgJHt0aGlzLmdldEJpbmRpbmdQcmVmaXgoKX0ke2tpbmR9YCB9XG5cbiAgY2hhbm5lbCh0b3BpYywgcGFyYW1zKXsgcmV0dXJuIHRoaXMuc29ja2V0LmNoYW5uZWwodG9waWMsIHBhcmFtcykgfVxuXG4gIGpvaW5Sb290Vmlld3MoKXtcbiAgICBsZXQgcm9vdHNGb3VuZCA9IGZhbHNlXG4gICAgRE9NLmFsbChkb2N1bWVudCwgYCR7UEhYX1ZJRVdfU0VMRUNUT1J9Om5vdChbJHtQSFhfUEFSRU5UX0lEfV0pYCwgcm9vdEVsID0+IHtcbiAgICAgIGlmKCF0aGlzLmdldFJvb3RCeUlkKHJvb3RFbC5pZCkpe1xuICAgICAgICBsZXQgdmlldyA9IHRoaXMubmV3Um9vdFZpZXcocm9vdEVsKVxuICAgICAgICB2aWV3LnNldEhyZWYodGhpcy5nZXRIcmVmKCkpXG4gICAgICAgIHZpZXcuam9pbigpXG4gICAgICAgIGlmKHJvb3RFbC5oYXNBdHRyaWJ1dGUoUEhYX01BSU4pKXsgdGhpcy5tYWluID0gdmlldyB9XG4gICAgICB9XG4gICAgICByb290c0ZvdW5kID0gdHJ1ZVxuICAgIH0pXG4gICAgcmV0dXJuIHJvb3RzRm91bmRcbiAgfVxuXG4gIHJlZGlyZWN0KHRvLCBmbGFzaCl7XG4gICAgdGhpcy5kaXNjb25uZWN0KClcbiAgICBCcm93c2VyLnJlZGlyZWN0KHRvLCBmbGFzaClcbiAgfVxuXG4gIHJlcGxhY2VNYWluKGhyZWYsIGZsYXNoLCBjYWxsYmFjayA9IG51bGwsIGxpbmtSZWYgPSB0aGlzLnNldFBlbmRpbmdMaW5rKGhyZWYpKXtcbiAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gdGhpcy5vdXRnb2luZ01haW5FbCB8fCB0aGlzLm1haW4uZWxcbiAgICBsZXQgbmV3TWFpbkVsID0gRE9NLmNsb25lTm9kZSh0aGlzLm91dGdvaW5nTWFpbkVsLCBcIlwiKVxuICAgIHRoaXMubWFpbi5zaG93TG9hZGVyKHRoaXMubG9hZGVyVGltZW91dClcbiAgICB0aGlzLm1haW4uZGVzdHJveSgpXG5cbiAgICB0aGlzLm1haW4gPSB0aGlzLm5ld1Jvb3RWaWV3KG5ld01haW5FbCwgZmxhc2gpXG4gICAgdGhpcy5tYWluLnNldFJlZGlyZWN0KGhyZWYpXG4gICAgdGhpcy50cmFuc2l0aW9uUmVtb3ZlcygpXG4gICAgdGhpcy5tYWluLmpvaW4oKGpvaW5Db3VudCwgb25Eb25lKSA9PiB7XG4gICAgICBpZihqb2luQ291bnQgPT09IDEgJiYgdGhpcy5jb21taXRQZW5kaW5nTGluayhsaW5rUmVmKSl7XG4gICAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgICAgRE9NLmZpbmRQaHhTdGlja3koZG9jdW1lbnQpLmZvckVhY2goZWwgPT4gbmV3TWFpbkVsLmFwcGVuZENoaWxkKGVsKSlcbiAgICAgICAgICB0aGlzLm91dGdvaW5nTWFpbkVsLnJlcGxhY2VXaXRoKG5ld01haW5FbClcbiAgICAgICAgICB0aGlzLm91dGdvaW5nTWFpbkVsID0gbnVsbFxuICAgICAgICAgIGNhbGxiYWNrICYmIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaylcbiAgICAgICAgICBvbkRvbmUoKVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICB0cmFuc2l0aW9uUmVtb3ZlcyhlbGVtZW50cyl7XG4gICAgbGV0IHJlbW92ZUF0dHIgPSB0aGlzLmJpbmRpbmcoXCJyZW1vdmVcIilcbiAgICBlbGVtZW50cyA9IGVsZW1lbnRzIHx8IERPTS5hbGwoZG9jdW1lbnQsIGBbJHtyZW1vdmVBdHRyfV1gKVxuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgaWYoZG9jdW1lbnQuYm9keS5jb250YWlucyhlbCkpeyAvLyBza2lwIGNoaWxkcmVuIGFscmVhZHkgcmVtb3ZlZFxuICAgICAgICB0aGlzLmV4ZWNKUyhlbCwgZWwuZ2V0QXR0cmlidXRlKHJlbW92ZUF0dHIpLCBcInJlbW92ZVwiKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBpc1BoeFZpZXcoZWwpeyByZXR1cm4gZWwuZ2V0QXR0cmlidXRlICYmIGVsLmdldEF0dHJpYnV0ZShQSFhfU0VTU0lPTikgIT09IG51bGwgfVxuXG4gIG5ld1Jvb3RWaWV3KGVsLCBmbGFzaCl7XG4gICAgbGV0IHZpZXcgPSBuZXcgVmlldyhlbCwgdGhpcywgbnVsbCwgZmxhc2gpXG4gICAgdGhpcy5yb290c1t2aWV3LmlkXSA9IHZpZXdcbiAgICByZXR1cm4gdmlld1xuICB9XG5cbiAgb3duZXIoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIGxldCB2aWV3ID0gbWF5YmUoY2hpbGRFbC5jbG9zZXN0KFBIWF9WSUVXX1NFTEVDVE9SKSwgZWwgPT4gdGhpcy5nZXRWaWV3QnlFbChlbCkpIHx8IHRoaXMubWFpblxuICAgIGlmKHZpZXcpeyBjYWxsYmFjayh2aWV3KSB9XG4gIH1cblxuICB3aXRoaW5Pd25lcnMoY2hpbGRFbCwgY2FsbGJhY2spe1xuICAgIHRoaXMub3duZXIoY2hpbGRFbCwgdmlldyA9PiBjYWxsYmFjayh2aWV3LCBjaGlsZEVsKSlcbiAgfVxuXG4gIGdldFZpZXdCeUVsKGVsKXtcbiAgICBsZXQgcm9vdElkID0gZWwuZ2V0QXR0cmlidXRlKFBIWF9ST09UX0lEKVxuICAgIHJldHVybiBtYXliZSh0aGlzLmdldFJvb3RCeUlkKHJvb3RJZCksIHJvb3QgPT4gcm9vdC5nZXREZXNjZW5kZW50QnlFbChlbCkpXG4gIH1cblxuICBnZXRSb290QnlJZChpZCl7IHJldHVybiB0aGlzLnJvb3RzW2lkXSB9XG5cbiAgZGVzdHJveUFsbFZpZXdzKCl7XG4gICAgZm9yKGxldCBpZCBpbiB0aGlzLnJvb3RzKXtcbiAgICAgIHRoaXMucm9vdHNbaWRdLmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbaWRdXG4gICAgfVxuICAgIHRoaXMubWFpbiA9IG51bGxcbiAgfVxuXG4gIGRlc3Ryb3lWaWV3QnlFbChlbCl7XG4gICAgbGV0IHJvb3QgPSB0aGlzLmdldFJvb3RCeUlkKGVsLmdldEF0dHJpYnV0ZShQSFhfUk9PVF9JRCkpXG4gICAgaWYocm9vdCAmJiByb290LmlkID09PSBlbC5pZCl7XG4gICAgICByb290LmRlc3Ryb3koKVxuICAgICAgZGVsZXRlIHRoaXMucm9vdHNbcm9vdC5pZF1cbiAgICB9IGVsc2UgaWYocm9vdCl7XG4gICAgICByb290LmRlc3Ryb3lEZXNjZW5kZW50KGVsLmlkKVxuICAgIH1cbiAgfVxuXG4gIHNldEFjdGl2ZUVsZW1lbnQodGFyZ2V0KXtcbiAgICBpZih0aGlzLmFjdGl2ZUVsZW1lbnQgPT09IHRhcmdldCl7IHJldHVybiB9XG4gICAgdGhpcy5hY3RpdmVFbGVtZW50ID0gdGFyZ2V0XG4gICAgbGV0IGNhbmNlbCA9ICgpID0+IHtcbiAgICAgIGlmKHRhcmdldCA9PT0gdGhpcy5hY3RpdmVFbGVtZW50KXsgdGhpcy5hY3RpdmVFbGVtZW50ID0gbnVsbCB9XG4gICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgdGhpcylcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgdGhpcylcbiAgICB9XG4gICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIGNhbmNlbClcbiAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGNhbmNlbClcbiAgfVxuXG4gIGdldEFjdGl2ZUVsZW1lbnQoKXtcbiAgICBpZihkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSBkb2N1bWVudC5ib2R5KXtcbiAgICAgIHJldHVybiB0aGlzLmFjdGl2ZUVsZW1lbnQgfHwgZG9jdW1lbnQuYWN0aXZlRWxlbWVudFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkb2N1bWVudC5hY3RpdmVFbGVtZW50IGNhbiBiZSBudWxsIGluIEludGVybmV0IEV4cGxvcmVyIDExXG4gICAgICByZXR1cm4gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCB8fCBkb2N1bWVudC5ib2R5XG4gICAgfVxuICB9XG5cbiAgZHJvcEFjdGl2ZUVsZW1lbnQodmlldyl7XG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICYmIHZpZXcub3duc0VsZW1lbnQodGhpcy5wcmV2QWN0aXZlKSl7XG4gICAgICB0aGlzLnByZXZBY3RpdmUgPSBudWxsXG4gICAgfVxuICB9XG5cbiAgcmVzdG9yZVByZXZpb3VzbHlBY3RpdmVGb2N1cygpe1xuICAgIGlmKHRoaXMucHJldkFjdGl2ZSAmJiB0aGlzLnByZXZBY3RpdmUgIT09IGRvY3VtZW50LmJvZHkpe1xuICAgICAgdGhpcy5wcmV2QWN0aXZlLmZvY3VzKClcbiAgICB9XG4gIH1cblxuICBibHVyQWN0aXZlRWxlbWVudCgpe1xuICAgIHRoaXMucHJldkFjdGl2ZSA9IHRoaXMuZ2V0QWN0aXZlRWxlbWVudCgpXG4gICAgaWYodGhpcy5wcmV2QWN0aXZlICE9PSBkb2N1bWVudC5ib2R5KXsgdGhpcy5wcmV2QWN0aXZlLmJsdXIoKSB9XG4gIH1cblxuICBiaW5kVG9wTGV2ZWxFdmVudHMoKXtcbiAgICBpZih0aGlzLmJvdW5kVG9wTGV2ZWxFdmVudHMpeyByZXR1cm4gfVxuXG4gICAgdGhpcy5ib3VuZFRvcExldmVsRXZlbnRzID0gdHJ1ZVxuICAgIC8vIGVudGVyIGZhaWxzYWZlIHJlbG9hZCBpZiBzZXJ2ZXIgaGFzIGdvbmUgYXdheSBpbnRlbnRpb25hbGx5LCBzdWNoIGFzIFwiZGlzY29ubmVjdFwiIGJyb2FkY2FzdFxuICAgIHRoaXMuc29ja2V0Lm9uQ2xvc2UoZXZlbnQgPT4ge1xuICAgICAgaWYoZXZlbnQgJiYgZXZlbnQuY29kZSA9PT0gMTAwMCAmJiB0aGlzLm1haW4pe1xuICAgICAgICB0aGlzLnJlbG9hZFdpdGhKaXR0ZXIodGhpcy5tYWluKVxuICAgICAgfVxuICAgIH0pXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCl7IH0pIC8vIGVuc3VyZSBhbGwgY2xpY2sgZXZlbnRzIGJ1YmJsZSBmb3IgbW9iaWxlIFNhZmFyaVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGFnZXNob3dcIiwgZSA9PiB7XG4gICAgICBpZihlLnBlcnNpc3RlZCl7IC8vIHJlbG9hZCBwYWdlIGlmIGJlaW5nIHJlc3RvcmVkIGZyb20gYmFjay9mb3J3YXJkIGNhY2hlXG4gICAgICAgIHRoaXMuZ2V0U29ja2V0KCkuZGlzY29ubmVjdCgpXG4gICAgICAgIHRoaXMud2l0aFBhZ2VMb2FkaW5nKHt0bzogd2luZG93LmxvY2F0aW9uLmhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0pXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKVxuICAgICAgfVxuICAgIH0sIHRydWUpXG4gICAgdGhpcy5iaW5kTmF2KClcbiAgICB0aGlzLmJpbmRDbGlja3MoKVxuICAgIHRoaXMuYmluZEZvcm1zKClcbiAgICB0aGlzLmJpbmQoe2tleXVwOiBcImtleXVwXCIsIGtleWRvd246IFwia2V5ZG93blwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgZXZlbnRUYXJnZXQpID0+IHtcbiAgICAgIGxldCBtYXRjaEtleSA9IHRhcmdldEVsLmdldEF0dHJpYnV0ZSh0aGlzLmJpbmRpbmcoUEhYX0tFWSkpXG4gICAgICBsZXQgcHJlc3NlZEtleSA9IGUua2V5ICYmIGUua2V5LnRvTG93ZXJDYXNlKCkgLy8gY2hyb21lIGNsaWNrZWQgYXV0b2NvbXBsZXRlcyBzZW5kIGEga2V5ZG93biB3aXRob3V0IGtleVxuICAgICAgaWYobWF0Y2hLZXkgJiYgbWF0Y2hLZXkudG9Mb3dlckNhc2UoKSAhPT0gcHJlc3NlZEtleSl7IHJldHVybiB9XG5cbiAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgIEpTLmV4ZWModHlwZSwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldEVsLCBbXCJwdXNoXCIsIHtkYXRhfV0pXG4gICAgfSlcbiAgICB0aGlzLmJpbmQoe2JsdXI6IFwiZm9jdXNvdXRcIiwgZm9jdXM6IFwiZm9jdXNpblwifSwgKGUsIHR5cGUsIHZpZXcsIHRhcmdldEVsLCBwaHhFdmVudCwgZXZlbnRUYXJnZXQpID0+IHtcbiAgICAgIGlmKCFldmVudFRhcmdldCl7XG4gICAgICAgIGxldCBkYXRhID0ge2tleTogZS5rZXksIC4uLnRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKX1cbiAgICAgICAgSlMuZXhlYyh0eXBlLCBwaHhFdmVudCwgdmlldywgdGFyZ2V0RWwsIFtcInB1c2hcIiwge2RhdGF9XSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHRoaXMuYmluZCh7Ymx1cjogXCJibHVyXCIsIGZvY3VzOiBcImZvY3VzXCJ9LCAoZSwgdHlwZSwgdmlldywgdGFyZ2V0RWwsIHRhcmdldEN0eCwgcGh4RXZlbnQsIHBoeFRhcmdldCkgPT4ge1xuICAgICAgLy8gYmx1ciBhbmQgZm9jdXMgYXJlIHRyaWdnZXJlZCBvbiBkb2N1bWVudCBhbmQgd2luZG93LiBEaXNjYXJkIG9uZSB0byBhdm9pZCBkdXBzXG4gICAgICBpZihwaHhUYXJnZXQgPT09IFwid2luZG93XCIpe1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuZXZlbnRNZXRhKHR5cGUsIGUsIHRhcmdldEVsKVxuICAgICAgICBKUy5leGVjKHR5cGUsIHBoeEV2ZW50LCB2aWV3LCB0YXJnZXRFbCwgW1wicHVzaFwiLCB7ZGF0YX1dKVxuICAgICAgfVxuICAgIH0pXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkcmFnb3ZlclwiLCBlID0+IGUucHJldmVudERlZmF1bHQoKSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGxldCBkcm9wVGFyZ2V0SWQgPSBtYXliZShjbG9zZXN0UGh4QmluZGluZyhlLnRhcmdldCwgdGhpcy5iaW5kaW5nKFBIWF9EUk9QX1RBUkdFVCkpLCB0cnVlVGFyZ2V0ID0+IHtcbiAgICAgICAgcmV0dXJuIHRydWVUYXJnZXQuZ2V0QXR0cmlidXRlKHRoaXMuYmluZGluZyhQSFhfRFJPUF9UQVJHRVQpKVxuICAgICAgfSlcbiAgICAgIGxldCBkcm9wVGFyZ2V0ID0gZHJvcFRhcmdldElkICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRyb3BUYXJnZXRJZClcbiAgICAgIGxldCBmaWxlcyA9IEFycmF5LmZyb20oZS5kYXRhVHJhbnNmZXIuZmlsZXMgfHwgW10pXG4gICAgICBpZighZHJvcFRhcmdldCB8fCBkcm9wVGFyZ2V0LmRpc2FibGVkIHx8IGZpbGVzLmxlbmd0aCA9PT0gMCB8fCAhKGRyb3BUYXJnZXQuZmlsZXMgaW5zdGFuY2VvZiBGaWxlTGlzdCkpeyByZXR1cm4gfVxuXG4gICAgICBMaXZlVXBsb2FkZXIudHJhY2tGaWxlcyhkcm9wVGFyZ2V0LCBmaWxlcylcbiAgICAgIGRyb3BUYXJnZXQuZGlzcGF0Y2hFdmVudChuZXcgRXZlbnQoXCJpbnB1dFwiLCB7YnViYmxlczogdHJ1ZX0pKVxuICAgIH0pXG4gICAgdGhpcy5vbihQSFhfVFJBQ0tfVVBMT0FEUywgZSA9PiB7XG4gICAgICBsZXQgdXBsb2FkVGFyZ2V0ID0gZS50YXJnZXRcbiAgICAgIGlmKCFET00uaXNVcGxvYWRJbnB1dCh1cGxvYWRUYXJnZXQpKXsgcmV0dXJuIH1cbiAgICAgIGxldCBmaWxlcyA9IEFycmF5LmZyb20oZS5kZXRhaWwuZmlsZXMgfHwgW10pLmZpbHRlcihmID0+IGYgaW5zdGFuY2VvZiBGaWxlIHx8IGYgaW5zdGFuY2VvZiBCbG9iKVxuICAgICAgTGl2ZVVwbG9hZGVyLnRyYWNrRmlsZXModXBsb2FkVGFyZ2V0LCBmaWxlcylcbiAgICAgIHVwbG9hZFRhcmdldC5kaXNwYXRjaEV2ZW50KG5ldyBFdmVudChcImlucHV0XCIsIHtidWJibGVzOiB0cnVlfSkpXG4gICAgfSlcbiAgfVxuXG4gIGV2ZW50TWV0YShldmVudE5hbWUsIGUsIHRhcmdldEVsKXtcbiAgICBsZXQgY2FsbGJhY2sgPSB0aGlzLm1ldGFkYXRhQ2FsbGJhY2tzW2V2ZW50TmFtZV1cbiAgICByZXR1cm4gY2FsbGJhY2sgPyBjYWxsYmFjayhlLCB0YXJnZXRFbCkgOiB7fVxuICB9XG5cbiAgc2V0UGVuZGluZ0xpbmsoaHJlZil7XG4gICAgdGhpcy5saW5rUmVmKytcbiAgICB0aGlzLnBlbmRpbmdMaW5rID0gaHJlZlxuICAgIHJldHVybiB0aGlzLmxpbmtSZWZcbiAgfVxuXG4gIGNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpe1xuICAgIGlmKHRoaXMubGlua1JlZiAhPT0gbGlua1JlZil7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5ocmVmID0gdGhpcy5wZW5kaW5nTGlua1xuICAgICAgdGhpcy5wZW5kaW5nTGluayA9IG51bGxcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuICB9XG5cbiAgZ2V0SHJlZigpeyByZXR1cm4gdGhpcy5ocmVmIH1cblxuICBoYXNQZW5kaW5nTGluaygpeyByZXR1cm4gISF0aGlzLnBlbmRpbmdMaW5rIH1cblxuICBiaW5kKGV2ZW50cywgY2FsbGJhY2spe1xuICAgIGZvcihsZXQgZXZlbnQgaW4gZXZlbnRzKXtcbiAgICAgIGxldCBicm93c2VyRXZlbnROYW1lID0gZXZlbnRzW2V2ZW50XVxuXG4gICAgICB0aGlzLm9uKGJyb3dzZXJFdmVudE5hbWUsIGUgPT4ge1xuICAgICAgICBsZXQgYmluZGluZyA9IHRoaXMuYmluZGluZyhldmVudClcbiAgICAgICAgbGV0IHdpbmRvd0JpbmRpbmcgPSB0aGlzLmJpbmRpbmcoYHdpbmRvdy0ke2V2ZW50fWApXG4gICAgICAgIGxldCB0YXJnZXRQaHhFdmVudCA9IGUudGFyZ2V0LmdldEF0dHJpYnV0ZSAmJiBlLnRhcmdldC5nZXRBdHRyaWJ1dGUoYmluZGluZylcbiAgICAgICAgaWYodGFyZ2V0UGh4RXZlbnQpe1xuICAgICAgICAgIHRoaXMuZGVib3VuY2UoZS50YXJnZXQsIGUsIGJyb3dzZXJFdmVudE5hbWUsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGUudGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgY2FsbGJhY2soZSwgZXZlbnQsIHZpZXcsIGUudGFyZ2V0LCB0YXJnZXRQaHhFdmVudCwgbnVsbClcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7d2luZG93QmluZGluZ31dYCwgZWwgPT4ge1xuICAgICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHdpbmRvd0JpbmRpbmcpXG4gICAgICAgICAgICB0aGlzLmRlYm91bmNlKGVsLCBlLCBicm93c2VyRXZlbnROYW1lLCAoKSA9PiB7XG4gICAgICAgICAgICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhlLCBldmVudCwgdmlldywgZWwsIHBoeEV2ZW50LCBcIndpbmRvd1wiKVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIGJpbmRDbGlja3MoKXtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBlID0+IHRoaXMuY2xpY2tTdGFydGVkQXRUYXJnZXQgPSBlLnRhcmdldClcbiAgICB0aGlzLmJpbmRDbGljayhcImNsaWNrXCIsIFwiY2xpY2tcIiwgZmFsc2UpXG4gICAgdGhpcy5iaW5kQ2xpY2soXCJtb3VzZWRvd25cIiwgXCJjYXB0dXJlLWNsaWNrXCIsIHRydWUpXG4gIH1cblxuICBiaW5kQ2xpY2soZXZlbnROYW1lLCBiaW5kaW5nTmFtZSwgY2FwdHVyZSl7XG4gICAgbGV0IGNsaWNrID0gdGhpcy5iaW5kaW5nKGJpbmRpbmdOYW1lKVxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZSA9PiB7XG4gICAgICBsZXQgdGFyZ2V0ID0gbnVsbFxuICAgICAgaWYoY2FwdHVyZSl7XG4gICAgICAgIHRhcmdldCA9IGUudGFyZ2V0Lm1hdGNoZXMoYFske2NsaWNrfV1gKSA/IGUudGFyZ2V0IDogZS50YXJnZXQucXVlcnlTZWxlY3RvcihgWyR7Y2xpY2t9XWApXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgY2xpY2tTdGFydGVkQXRUYXJnZXQgPSB0aGlzLmNsaWNrU3RhcnRlZEF0VGFyZ2V0IHx8IGUudGFyZ2V0XG4gICAgICAgIHRhcmdldCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGNsaWNrU3RhcnRlZEF0VGFyZ2V0LCBjbGljaylcbiAgICAgICAgdGhpcy5kaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdFRhcmdldClcbiAgICAgICAgdGhpcy5jbGlja1N0YXJ0ZWRBdFRhcmdldCA9IG51bGxcbiAgICAgIH1cbiAgICAgIGxldCBwaHhFdmVudCA9IHRhcmdldCAmJiB0YXJnZXQuZ2V0QXR0cmlidXRlKGNsaWNrKVxuICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoXCJocmVmXCIpID09PSBcIiNcIil7IGUucHJldmVudERlZmF1bHQoKSB9XG5cbiAgICAgIHRoaXMuZGVib3VuY2UodGFyZ2V0LCBlLCBcImNsaWNrXCIsICgpID0+IHtcbiAgICAgICAgdGhpcy53aXRoaW5Pd25lcnModGFyZ2V0LCB2aWV3ID0+IHtcbiAgICAgICAgICBKUy5leGVjKFwiY2xpY2tcIiwgcGh4RXZlbnQsIHZpZXcsIHRhcmdldCwgW1wicHVzaFwiLCB7ZGF0YTogdGhpcy5ldmVudE1ldGEoXCJjbGlja1wiLCBlLCB0YXJnZXQpfV0pXG4gICAgICAgIH0pXG4gICAgICB9KVxuICAgIH0sIGNhcHR1cmUpXG4gIH1cblxuICBkaXNwYXRjaENsaWNrQXdheShlLCBjbGlja1N0YXJ0ZWRBdCl7XG4gICAgbGV0IHBoeENsaWNrQXdheSA9IHRoaXMuYmluZGluZyhcImNsaWNrLWF3YXlcIilcbiAgICBET00uYWxsKGRvY3VtZW50LCBgWyR7cGh4Q2xpY2tBd2F5fV1gLCBlbCA9PiB7XG4gICAgICBpZighKGVsLmlzU2FtZU5vZGUoY2xpY2tTdGFydGVkQXQpIHx8IGVsLmNvbnRhaW5zKGNsaWNrU3RhcnRlZEF0KSkpe1xuICAgICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgICAgbGV0IHBoeEV2ZW50ID0gZWwuZ2V0QXR0cmlidXRlKHBoeENsaWNrQXdheSlcbiAgICAgICAgICBpZihKUy5pc1Zpc2libGUoZWwpKXtcbiAgICAgICAgICAgIEpTLmV4ZWMoXCJjbGlja1wiLCBwaHhFdmVudCwgdmlldywgZWwsIFtcInB1c2hcIiwge2RhdGE6IHRoaXMuZXZlbnRNZXRhKFwiY2xpY2tcIiwgZSwgZS50YXJnZXQpfV0pXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBiaW5kTmF2KCl7XG4gICAgaWYoIUJyb3dzZXIuY2FuUHVzaFN0YXRlKCkpeyByZXR1cm4gfVxuICAgIGlmKGhpc3Rvcnkuc2Nyb2xsUmVzdG9yYXRpb24peyBoaXN0b3J5LnNjcm9sbFJlc3RvcmF0aW9uID0gXCJtYW51YWxcIiB9XG4gICAgbGV0IHNjcm9sbFRpbWVyID0gbnVsbFxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwic2Nyb2xsXCIsIF9lID0+IHtcbiAgICAgIGNsZWFyVGltZW91dChzY3JvbGxUaW1lcilcbiAgICAgIHNjcm9sbFRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIEJyb3dzZXIudXBkYXRlQ3VycmVudFN0YXRlKHN0YXRlID0+IE9iamVjdC5hc3NpZ24oc3RhdGUsIHtzY3JvbGw6IHdpbmRvdy5zY3JvbGxZfSkpXG4gICAgICB9LCAxMDApXG4gICAgfSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInBvcHN0YXRlXCIsIGV2ZW50ID0+IHtcbiAgICAgIGlmKCF0aGlzLnJlZ2lzdGVyTmV3TG9jYXRpb24od2luZG93LmxvY2F0aW9uKSl7IHJldHVybiB9XG4gICAgICBsZXQge3R5cGUsIGlkLCByb290LCBzY3JvbGx9ID0gZXZlbnQuc3RhdGUgfHwge31cbiAgICAgIGxldCBocmVmID0gd2luZG93LmxvY2F0aW9uLmhyZWZcblxuICAgICAgdGhpcy5yZXF1ZXN0RE9NVXBkYXRlKCgpID0+IHtcbiAgICAgICAgaWYodGhpcy5tYWluLmlzQ29ubmVjdGVkKCkgJiYgKHR5cGUgPT09IFwicGF0Y2hcIiAmJiBpZCA9PT0gdGhpcy5tYWluLmlkKSl7XG4gICAgICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goaHJlZiwgbnVsbClcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlcGxhY2VNYWluKGhyZWYsIG51bGwsICgpID0+IHtcbiAgICAgICAgICAgIGlmKHJvb3QpeyB0aGlzLnJlcGxhY2VSb290SGlzdG9yeSgpIH1cbiAgICAgICAgICAgIGlmKHR5cGVvZihzY3JvbGwpID09PSBcIm51bWJlclwiKXtcbiAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgd2luZG93LnNjcm9sbFRvKDAsIHNjcm9sbClcbiAgICAgICAgICAgICAgfSwgMCkgLy8gdGhlIGJvZHkgbmVlZHMgdG8gcmVuZGVyIGJlZm9yZSB3ZSBzY3JvbGwuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBmYWxzZSlcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGUgPT4ge1xuICAgICAgbGV0IHRhcmdldCA9IGNsb3Nlc3RQaHhCaW5kaW5nKGUudGFyZ2V0LCBQSFhfTElWRV9MSU5LKVxuICAgICAgbGV0IHR5cGUgPSB0YXJnZXQgJiYgdGFyZ2V0LmdldEF0dHJpYnV0ZShQSFhfTElWRV9MSU5LKVxuICAgICAgbGV0IHdhbnRzTmV3VGFiID0gZS5tZXRhS2V5IHx8IGUuY3RybEtleSB8fCBlLmJ1dHRvbiA9PT0gMVxuICAgICAgaWYoIXR5cGUgfHwgIXRoaXMuaXNDb25uZWN0ZWQoKSB8fCAhdGhpcy5tYWluIHx8IHdhbnRzTmV3VGFiKXsgcmV0dXJuIH1cblxuICAgICAgbGV0IGhyZWYgPSB0YXJnZXQuaHJlZlxuICAgICAgbGV0IGxpbmtTdGF0ZSA9IHRhcmdldC5nZXRBdHRyaWJ1dGUoUEhYX0xJTktfU1RBVEUpXG4gICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCkgLy8gZG8gbm90IGJ1YmJsZSBjbGljayB0byByZWd1bGFyIHBoeC1jbGljayBiaW5kaW5nc1xuICAgICAgaWYodGhpcy5wZW5kaW5nTGluayA9PT0gaHJlZil7IHJldHVybiB9XG5cbiAgICAgIHRoaXMucmVxdWVzdERPTVVwZGF0ZSgoKSA9PiB7XG4gICAgICAgIGlmKHR5cGUgPT09IFwicGF0Y2hcIil7XG4gICAgICAgICAgdGhpcy5wdXNoSGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgdGFyZ2V0KVxuICAgICAgICB9IGVsc2UgaWYodHlwZSA9PT0gXCJyZWRpcmVjdFwiKXtcbiAgICAgICAgICB0aGlzLmhpc3RvcnlSZWRpcmVjdChocmVmLCBsaW5rU3RhdGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBleHBlY3RlZCAke1BIWF9MSVZFX0xJTkt9IHRvIGJlIFwicGF0Y2hcIiBvciBcInJlZGlyZWN0XCIsIGdvdDogJHt0eXBlfWApXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2ZW50LCBwYXlsb2FkID0ge30pe1xuICAgIERPTS5kaXNwYXRjaEV2ZW50KHdpbmRvdywgYHBoeDoke2V2ZW50fWAsIHtkZXRhaWw6IHBheWxvYWR9KVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudHMoZXZlbnRzKXtcbiAgICBldmVudHMuZm9yRWFjaCgoW2V2ZW50LCBwYXlsb2FkXSkgPT4gdGhpcy5kaXNwYXRjaEV2ZW50KGV2ZW50LCBwYXlsb2FkKSlcbiAgfVxuXG4gIHdpdGhQYWdlTG9hZGluZyhpbmZvLCBjYWxsYmFjayl7XG4gICAgRE9NLmRpc3BhdGNoRXZlbnQod2luZG93LCBcInBoeDpwYWdlLWxvYWRpbmctc3RhcnRcIiwge2RldGFpbDogaW5mb30pXG4gICAgbGV0IGRvbmUgPSAoKSA9PiBET00uZGlzcGF0Y2hFdmVudCh3aW5kb3csIFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIHtkZXRhaWw6IGluZm99KVxuICAgIHJldHVybiBjYWxsYmFjayA/IGNhbGxiYWNrKGRvbmUpIDogZG9uZVxuICB9XG5cbiAgcHVzaEhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIHRhcmdldEVsKXtcbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicGF0Y2hcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5tYWluLnB1c2hMaW5rUGF0Y2goaHJlZiwgdGFyZ2V0RWwsIGxpbmtSZWYgPT4ge1xuICAgICAgICB0aGlzLmhpc3RvcnlQYXRjaChocmVmLCBsaW5rU3RhdGUsIGxpbmtSZWYpXG4gICAgICAgIGRvbmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG5cbiAgaGlzdG9yeVBhdGNoKGhyZWYsIGxpbmtTdGF0ZSwgbGlua1JlZiA9IHRoaXMuc2V0UGVuZGluZ0xpbmsoaHJlZikpe1xuICAgIGlmKCF0aGlzLmNvbW1pdFBlbmRpbmdMaW5rKGxpbmtSZWYpKXsgcmV0dXJuIH1cblxuICAgIEJyb3dzZXIucHVzaFN0YXRlKGxpbmtTdGF0ZSwge3R5cGU6IFwicGF0Y2hcIiwgaWQ6IHRoaXMubWFpbi5pZH0sIGhyZWYpXG4gICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbilcbiAgfVxuXG4gIGhpc3RvcnlSZWRpcmVjdChocmVmLCBsaW5rU3RhdGUsIGZsYXNoKXtcbiAgICBsZXQgc2Nyb2xsID0gd2luZG93LnNjcm9sbFlcbiAgICB0aGlzLndpdGhQYWdlTG9hZGluZyh7dG86IGhyZWYsIGtpbmQ6IFwicmVkaXJlY3RcIn0sIGRvbmUgPT4ge1xuICAgICAgdGhpcy5yZXBsYWNlTWFpbihocmVmLCBmbGFzaCwgKCkgPT4ge1xuICAgICAgICBCcm93c2VyLnB1c2hTdGF0ZShsaW5rU3RhdGUsIHt0eXBlOiBcInJlZGlyZWN0XCIsIGlkOiB0aGlzLm1haW4uaWQsIHNjcm9sbDogc2Nyb2xsfSwgaHJlZilcbiAgICAgICAgdGhpcy5yZWdpc3Rlck5ld0xvY2F0aW9uKHdpbmRvdy5sb2NhdGlvbilcbiAgICAgICAgZG9uZSgpXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICByZXBsYWNlUm9vdEhpc3RvcnkoKXtcbiAgICBCcm93c2VyLnB1c2hTdGF0ZShcInJlcGxhY2VcIiwge3Jvb3Q6IHRydWUsIHR5cGU6IFwicGF0Y2hcIiwgaWQ6IHRoaXMubWFpbi5pZH0pXG4gIH1cblxuICByZWdpc3Rlck5ld0xvY2F0aW9uKG5ld0xvY2F0aW9uKXtcbiAgICBsZXQge3BhdGhuYW1lLCBzZWFyY2h9ID0gdGhpcy5jdXJyZW50TG9jYXRpb25cbiAgICBpZihwYXRobmFtZSArIHNlYXJjaCA9PT0gbmV3TG9jYXRpb24ucGF0aG5hbWUgKyBuZXdMb2NhdGlvbi5zZWFyY2gpe1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY3VycmVudExvY2F0aW9uID0gY2xvbmUobmV3TG9jYXRpb24pXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGJpbmRGb3Jtcygpe1xuICAgIGxldCBpdGVyYXRpb25zID0gMFxuICAgIHRoaXMub24oXCJzdWJtaXRcIiwgZSA9PiB7XG4gICAgICBsZXQgcGh4RXZlbnQgPSBlLnRhcmdldC5nZXRBdHRyaWJ1dGUodGhpcy5iaW5kaW5nKFwic3VibWl0XCIpKVxuICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgIGUucHJldmVudERlZmF1bHQoKVxuICAgICAgZS50YXJnZXQuZGlzYWJsZWQgPSB0cnVlXG4gICAgICB0aGlzLndpdGhpbk93bmVycyhlLnRhcmdldCwgdmlldyA9PiB7XG4gICAgICAgIEpTLmV4ZWMoXCJzdWJtaXRcIiwgcGh4RXZlbnQsIHZpZXcsIGUudGFyZ2V0LCBbXCJwdXNoXCIsIHt9XSlcbiAgICAgIH0pXG4gICAgfSwgZmFsc2UpXG5cbiAgICBmb3IobGV0IHR5cGUgb2YgW1wiY2hhbmdlXCIsIFwiaW5wdXRcIl0pe1xuICAgICAgdGhpcy5vbih0eXBlLCBlID0+IHtcbiAgICAgICAgbGV0IHBoeENoYW5nZSA9IHRoaXMuYmluZGluZyhcImNoYW5nZVwiKVxuICAgICAgICBsZXQgaW5wdXQgPSBlLnRhcmdldFxuICAgICAgICBsZXQgaW5wdXRFdmVudCA9IGlucHV0LmdldEF0dHJpYnV0ZShwaHhDaGFuZ2UpXG4gICAgICAgIGxldCBmb3JtRXZlbnQgPSBpbnB1dC5mb3JtICYmIGlucHV0LmZvcm0uZ2V0QXR0cmlidXRlKHBoeENoYW5nZSlcbiAgICAgICAgbGV0IHBoeEV2ZW50ID0gaW5wdXRFdmVudCB8fCBmb3JtRXZlbnRcbiAgICAgICAgaWYoIXBoeEV2ZW50KXsgcmV0dXJuIH1cbiAgICAgICAgaWYoaW5wdXQudHlwZSA9PT0gXCJudW1iZXJcIiAmJiBpbnB1dC52YWxpZGl0eSAmJiBpbnB1dC52YWxpZGl0eS5iYWRJbnB1dCl7IHJldHVybiB9XG5cbiAgICAgICAgbGV0IGRpc3BhdGNoZXIgPSBpbnB1dEV2ZW50ID8gaW5wdXQgOiBpbnB1dC5mb3JtXG4gICAgICAgIGxldCBjdXJyZW50SXRlcmF0aW9ucyA9IGl0ZXJhdGlvbnNcbiAgICAgICAgaXRlcmF0aW9ucysrXG4gICAgICAgIGxldCB7YXQ6IGF0LCB0eXBlOiBsYXN0VHlwZX0gPSBET00ucHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiKSB8fCB7fVxuICAgICAgICAvLyBkZXRlY3QgZHVwIGJlY2F1c2Ugc29tZSBicm93c2VycyBkaXNwYXRjaCBib3RoIFwiaW5wdXRcIiBhbmQgXCJjaGFuZ2VcIlxuICAgICAgICBpZihhdCA9PT0gY3VycmVudEl0ZXJhdGlvbnMgLSAxICYmIHR5cGUgIT09IGxhc3RUeXBlKXsgcmV0dXJuIH1cblxuICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgXCJwcmV2LWl0ZXJhdGlvblwiLCB7YXQ6IGN1cnJlbnRJdGVyYXRpb25zLCB0eXBlOiB0eXBlfSlcblxuICAgICAgICB0aGlzLmRlYm91bmNlKGlucHV0LCBlLCB0eXBlLCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy53aXRoaW5Pd25lcnMoZGlzcGF0Y2hlciwgdmlldyA9PiB7XG4gICAgICAgICAgICBET00ucHV0UHJpdmF0ZShpbnB1dCwgUEhYX0hBU19GT0NVU0VELCB0cnVlKVxuICAgICAgICAgICAgaWYoIURPTS5pc1RleHR1YWxJbnB1dChpbnB1dCkpe1xuICAgICAgICAgICAgICB0aGlzLnNldEFjdGl2ZUVsZW1lbnQoaW5wdXQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBKUy5leGVjKFwiY2hhbmdlXCIsIHBoeEV2ZW50LCB2aWV3LCBpbnB1dCwgW1wicHVzaFwiLCB7X3RhcmdldDogZS50YXJnZXQubmFtZSwgZGlzcGF0Y2hlcjogZGlzcGF0Y2hlcn1dKVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pXG4gICAgICB9LCBmYWxzZSlcbiAgICB9XG4gIH1cblxuICBkZWJvdW5jZShlbCwgZXZlbnQsIGV2ZW50VHlwZSwgY2FsbGJhY2spe1xuICAgIGlmKGV2ZW50VHlwZSA9PT0gXCJibHVyXCIgfHwgZXZlbnRUeXBlID09PSBcImZvY3Vzb3V0XCIpeyByZXR1cm4gY2FsbGJhY2soKSB9XG5cbiAgICBsZXQgcGh4RGVib3VuY2UgPSB0aGlzLmJpbmRpbmcoUEhYX0RFQk9VTkNFKVxuICAgIGxldCBwaHhUaHJvdHRsZSA9IHRoaXMuYmluZGluZyhQSFhfVEhST1RUTEUpXG4gICAgbGV0IGRlZmF1bHREZWJvdW5jZSA9IHRoaXMuZGVmYXVsdHMuZGVib3VuY2UudG9TdHJpbmcoKVxuICAgIGxldCBkZWZhdWx0VGhyb3R0bGUgPSB0aGlzLmRlZmF1bHRzLnRocm90dGxlLnRvU3RyaW5nKClcblxuICAgIHRoaXMud2l0aGluT3duZXJzKGVsLCB2aWV3ID0+IHtcbiAgICAgIGxldCBhc3luY0ZpbHRlciA9ICgpID0+ICF2aWV3LmlzRGVzdHJveWVkKCkgJiYgZG9jdW1lbnQuYm9keS5jb250YWlucyhlbClcbiAgICAgIERPTS5kZWJvdW5jZShlbCwgZXZlbnQsIHBoeERlYm91bmNlLCBkZWZhdWx0RGVib3VuY2UsIHBoeFRocm90dGxlLCBkZWZhdWx0VGhyb3R0bGUsIGFzeW5jRmlsdGVyLCAoKSA9PiB7XG4gICAgICAgIGNhbGxiYWNrKClcbiAgICAgIH0pXG4gICAgfSlcbiAgfVxuXG4gIHNpbGVuY2VFdmVudHMoY2FsbGJhY2spe1xuICAgIHRoaXMuc2lsZW5jZWQgPSB0cnVlXG4gICAgY2FsbGJhY2soKVxuICAgIHRoaXMuc2lsZW5jZWQgPSBmYWxzZVxuICB9XG5cbiAgb24oZXZlbnQsIGNhbGxiYWNrKXtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZSA9PiB7XG4gICAgICBpZighdGhpcy5zaWxlbmNlZCl7IGNhbGxiYWNrKGUpIH1cbiAgICB9KVxuICB9XG59XG5cbmNsYXNzIFRyYW5zaXRpb25TZXQge1xuICBjb25zdHJ1Y3Rvcigpe1xuICAgIHRoaXMudHJhbnNpdGlvbnMgPSBuZXcgU2V0KClcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICAgIHRoaXMucmVzZXQoKVxuICB9XG5cbiAgcmVzZXQoKXtcbiAgICB0aGlzLnRyYW5zaXRpb25zLmZvckVhY2godGltZXIgPT4ge1xuICAgICAgY2FuY2VsVGltZW91dCh0aW1lcilcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKVxuICAgIH0pXG4gICAgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKVxuICB9XG5cbiAgYWZ0ZXIoY2FsbGJhY2spe1xuICAgIGlmKHRoaXMuc2l6ZSgpID09PSAwKXtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wdXNoUGVuZGluZ09wKGNhbGxiYWNrKVxuICAgIH1cbiAgfVxuXG4gIGFkZFRyYW5zaXRpb24odGltZSwgb25TdGFydCwgb25Eb25lKXtcbiAgICBvblN0YXJ0KClcbiAgICBsZXQgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbnMuZGVsZXRlKHRpbWVyKVxuICAgICAgb25Eb25lKClcbiAgICAgIGlmKHRoaXMuc2l6ZSgpID09PSAwKXsgdGhpcy5mbHVzaFBlbmRpbmdPcHMoKSB9XG4gICAgfSwgdGltZSlcbiAgICB0aGlzLnRyYW5zaXRpb25zLmFkZCh0aW1lcilcbiAgfVxuXG4gIHB1c2hQZW5kaW5nT3Aob3ApeyB0aGlzLnBlbmRpbmdPcHMucHVzaChvcCkgfVxuXG4gIHNpemUoKXsgcmV0dXJuIHRoaXMudHJhbnNpdGlvbnMuc2l6ZSB9XG5cbiAgZmx1c2hQZW5kaW5nT3BzKCl7XG4gICAgdGhpcy5wZW5kaW5nT3BzLmZvckVhY2gob3AgPT4gb3AoKSlcbiAgICB0aGlzLnBlbmRpbmdPcHMgPSBbXVxuICB9XG59XG4iLCAiLy8gV2UgaW1wb3J0IHRoZSBDU1Mgd2hpY2ggaXMgZXh0cmFjdGVkIHRvIGl0cyBvd24gZmlsZSBieSBlc2J1aWxkLlxuLy8gUmVtb3ZlIHRoaXMgbGluZSBpZiB5b3UgYWRkIGEgeW91ciBvd24gQ1NTIGJ1aWxkIHBpcGVsaW5lIChlLmcgcG9zdGNzcykuXG5cbi8vIElmIHlvdSB3YW50IHRvIHVzZSBQaG9lbml4IGNoYW5uZWxzLCBydW4gYG1peCBoZWxwIHBoeC5nZW4uY2hhbm5lbGBcbi8vIHRvIGdldCBzdGFydGVkIGFuZCB0aGVuIHVuY29tbWVudCB0aGUgbGluZSBiZWxvdy5cbi8vIGltcG9ydCBcIi4vdXNlcl9zb2NrZXQuanNcIlxuXG4vLyBZb3UgY2FuIGluY2x1ZGUgZGVwZW5kZW5jaWVzIGluIHR3byB3YXlzLlxuLy9cbi8vIFRoZSBzaW1wbGVzdCBvcHRpb24gaXMgdG8gcHV0IHRoZW0gaW4gYXNzZXRzL3ZlbmRvciBhbmRcbi8vIGltcG9ydCB0aGVtIHVzaW5nIHJlbGF0aXZlIHBhdGhzOlxuLy9cbi8vICAgICBpbXBvcnQgXCIuLi92ZW5kb3Ivc29tZS1wYWNrYWdlLmpzXCJcbi8vXG4vLyBBbHRlcm5hdGl2ZWx5LCB5b3UgY2FuIGBucG0gaW5zdGFsbCBzb21lLXBhY2thZ2UgLS1wcmVmaXggYXNzZXRzYCBhbmQgaW1wb3J0XG4vLyB0aGVtIHVzaW5nIGEgcGF0aCBzdGFydGluZyB3aXRoIHRoZSBwYWNrYWdlIG5hbWU6XG4vL1xuLy8gICAgIGltcG9ydCBcInNvbWUtcGFja2FnZVwiXG4vL1xuXG4vLyBJbmNsdWRlIHBob2VuaXhfaHRtbCB0byBoYW5kbGUgbWV0aG9kPVBVVC9ERUxFVEUgaW4gZm9ybXMgYW5kIGJ1dHRvbnMuXG5pbXBvcnQgXCJwaG9lbml4X2h0bWxcIlxuLy8gRXN0YWJsaXNoIFBob2VuaXggU29ja2V0IGFuZCBMaXZlVmlldyBjb25maWd1cmF0aW9uLlxuaW1wb3J0IHtTb2NrZXR9IGZyb20gXCJwaG9lbml4XCJcbmltcG9ydCB7TGl2ZVNvY2tldH0gZnJvbSBcInBob2VuaXhfbGl2ZV92aWV3XCJcbmltcG9ydCB0b3BiYXIgZnJvbSBcIi4uL3ZlbmRvci90b3BiYXJcIlxuaW1wb3J0IEhvb2tzIGZyb20gXCIuL2hvb2tzXCJcblxubGV0IGNzcmZUb2tlbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCJtZXRhW25hbWU9J2NzcmYtdG9rZW4nXVwiKS5nZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIpXG5sZXQgbGl2ZVNvY2tldCA9IG5ldyBMaXZlU29ja2V0KFwiL2xpdmVcIiwgU29ja2V0LCB7cGFyYW1zOiB7X2NzcmZfdG9rZW46IGNzcmZUb2tlbn0sIGhvb2tzOiBIb29rc30pXG5cbi8vIFNob3cgcHJvZ3Jlc3MgYmFyIG9uIGxpdmUgbmF2aWdhdGlvbiBhbmQgZm9ybSBzdWJtaXRzXG50b3BiYXIuY29uZmlnKHtiYXJDb2xvcnM6IHswOiBcIiMyOWRcIn0sIHNoYWRvd0NvbG9yOiBcInJnYmEoMCwgMCwgMCwgLjMpXCJ9KVxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJwaHg6cGFnZS1sb2FkaW5nLXN0YXJ0XCIsIGluZm8gPT4gdG9wYmFyLnNob3coKSlcbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicGh4OnBhZ2UtbG9hZGluZy1zdG9wXCIsIGluZm8gPT4gdG9wYmFyLmhpZGUoKSlcblxuLy8gY29ubmVjdCBpZiB0aGVyZSBhcmUgYW55IExpdmVWaWV3cyBvbiB0aGUgcGFnZVxubGl2ZVNvY2tldC5jb25uZWN0KClcblxuLy8gZXhwb3NlIGxpdmVTb2NrZXQgb24gd2luZG93IGZvciB3ZWIgY29uc29sZSBkZWJ1ZyBsb2dzIGFuZCBsYXRlbmN5IHNpbXVsYXRpb246XG4vLyA+PiBsaXZlU29ja2V0LmVuYWJsZURlYnVnKClcbi8vID4+IGxpdmVTb2NrZXQuZW5hYmxlTGF0ZW5jeVNpbSgxMDAwKSAgLy8gZW5hYmxlZCBmb3IgZHVyYXRpb24gb2YgYnJvd3NlciBzZXNzaW9uXG4vLyA+PiBsaXZlU29ja2V0LmRpc2FibGVMYXRlbmN5U2ltKClcbndpbmRvdy5saXZlU29ja2V0ID0gbGl2ZVNvY2tldFxuXG4iLCAidmFyIHY9e2ZpZWxkU2VwYXJhdG9yOlwiLFwiLGRlY2ltYWxTZXBhcmF0b3I6XCIuXCIscXVvdGVTdHJpbmdzOiEwLHF1b3RlQ2hhcmFjdGVyOidcIicsc2hvd1RpdGxlOiExLHRpdGxlOlwiTXkgR2VuZXJhdGVkIFJlcG9ydFwiLGZpbGVuYW1lOlwiZ2VuZXJhdGVkXCIsc2hvd0NvbHVtbkhlYWRlcnM6ITAsdXNlVGV4dEZpbGU6ITEsdXNlQm9tOiEwLGNvbHVtbkhlYWRlcnM6W10sdXNlS2V5c0FzSGVhZGVyczohMSxib29sRGlzcGxheTp7dHJ1ZTpcIlRSVUVcIixmYWxzZTpcIkZBTFNFXCJ9LHJlcGxhY2VVbmRlZmluZWRXaXRoOlwiXCJ9LEI9XCJcXHJcXG5cIixGPVwiXFx1RkVGRlwiLFk9KHgpPT5PYmplY3QuYXNzaWduKHt9LHYseCk7Y2xhc3MgWiBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHgpe3N1cGVyKHgpO3RoaXMubmFtZT1cIkNzdkdlbmVyYXRpb25FcnJvclwifX1jbGFzcyBfIGV4dGVuZHMgRXJyb3J7Y29uc3RydWN0b3IoeCl7c3VwZXIoeCk7dGhpcy5uYW1lPVwiRW1wdHlIZWFkZXJzRXJyb3JcIn19Y2xhc3MgJCBleHRlbmRzIEVycm9ye2NvbnN0cnVjdG9yKHgpe3N1cGVyKHgpO3RoaXMubmFtZT1cIkNzdkRvd25sb2FkRW52aXJvbm1lbnRFcnJvclwifX12YXIgVT0oeCk9Pngsej0oeCk9PngsVz1VLFg9VSxRPVUsVD1VO3ZhciB3PWZ1bmN0aW9uKHgsQSl7aWYoQT09J1wiJyYmeC5pbmRleE9mKCdcIicpPi0xKXJldHVybiB4LnJlcGxhY2UoL1wiL2csJ1wiXCInKTtyZXR1cm4geH0sSD0oeCk9PnR5cGVvZiB4PT09XCJvYmplY3RcIj9RKHgua2V5KTpRKHgpLEQ9KHgpPT50eXBlb2YgeD09PVwib2JqZWN0XCI/VCh4LmRpc3BsYXlMYWJlbCk6VCh4KSxWPSh4LC4uLkEpPT5BLnJlZHVjZSgoTixqKT0+aihOKSx4KSxLPSh4KT0+KEEpPT54LnVzZUJvbT9XKHooQSkrRik6QSxMPSh4KT0+KEEpPT54LnNob3dUaXRsZT9XKHooQSkreC50aXRsZSk6QSxQPSh4KT0+KEEpPT5XKHooeCkreihBKStCKSxSPSh4KT0+KEEsTik9PmgoeCkoWChBK04pKSxoPSh4KT0+KEEpPT5VKHooQSkreC5maWVsZFNlcGFyYXRvciksRT0oeCxBKT0+KE4pPT57aWYoIXguc2hvd0NvbHVtbkhlYWRlcnMpcmV0dXJuIE47aWYoQS5sZW5ndGg8MSl0aHJvdyBuZXcgXyhcIk9wdGlvbiB0byBzaG93IGhlYWRlcnMgYnV0IG5vbmUgc3VwcGxpZWQuIE1ha2Ugc3VyZSB0aGVyZSBhcmUga2V5cyBpbiB5b3VyIGNvbGxlY3Rpb24gb3IgdGhhdCB5b3UndmUgc3VwcGxpZWQgaGVhZGVycyB0aHJvdWdoIHRoZSBjb25maWcgb3B0aW9ucy5cIik7bGV0IGo9WChcIlwiKTtmb3IobGV0IEc9MDtHPEEubGVuZ3RoO0crKyl7Y29uc3QgSj1EKEFbR10pO2o9Uih4KShqLEMoeCxKKSl9cmV0dXJuIGo9WCh6KGopLnNsaWNlKDAsLTEpKSxQKE4pKGopfSxPPSh4LEEsTik9PihqKT0+e2xldCBHPWo7Zm9yKHZhciBKPTA7SjxOLmxlbmd0aDtKKyspe2xldCBTPVgoXCJcIik7Zm9yKGxldCBJPTA7STxBLmxlbmd0aDtJKyspe2NvbnN0IHE9SChBW0ldKSxiPXR5cGVvZiBOW0pdW3oocSldPT09XCJ1bmRlZmluZWRcIj94LnJlcGxhY2VVbmRlZmluZWRXaXRoOk5bSl1beihxKV07Uz1SKHgpKFMsQyh4LGIpKX1TPVgoeihTKS5zbGljZSgwLC0xKSksRz1QKEcpKFMpfXJldHVybiBHfSx5PXosTT0oeCk9Pit4PT09eCYmKCFpc0Zpbml0ZSh4KXx8Qm9vbGVhbih4JTEpKSxDPSh4LEEpPT57aWYoeC5kZWNpbWFsU2VwYXJhdG9yPT09XCJsb2NhbGVcIiYmTShBKSlyZXR1cm4gQS50b0xvY2FsZVN0cmluZygpO2lmKHguZGVjaW1hbFNlcGFyYXRvciE9PVwiLlwiJiZNKEEpKXJldHVybiBBLnRvU3RyaW5nKCkucmVwbGFjZShcIi5cIix4LmRlY2ltYWxTZXBhcmF0b3IpO2lmKHR5cGVvZiBBPT09XCJzdHJpbmdcIil7bGV0IE49QTtpZih4LnF1b3RlU3RyaW5nc3x8eC5maWVsZFNlcGFyYXRvciYmQS5pbmRleE9mKHguZmllbGRTZXBhcmF0b3IpPi0xfHx4LnF1b3RlQ2hhcmFjdGVyJiZBLmluZGV4T2YoeC5xdW90ZUNoYXJhY3Rlcik+LTF8fEEuaW5kZXhPZihcIlxcblwiKT4tMXx8QS5pbmRleE9mKFwiXFxyXCIpPi0xKU49eC5xdW90ZUNoYXJhY3Rlcit3KEEseC5xdW90ZUNoYXJhY3RlcikreC5xdW90ZUNoYXJhY3RlcjtyZXR1cm4gTn1pZih0eXBlb2YgQT09PVwiYm9vbGVhblwiJiZ4LmJvb2xEaXNwbGF5KXtjb25zdCBOPUE/XCJ0cnVlXCI6XCJmYWxzZVwiO3JldHVybiB4LmJvb2xEaXNwbGF5W05dfXJldHVybiBBfTt2YXIgR3g9KHgpPT4oQSk9Pntjb25zdCBOPVkoeCksaj1OLnVzZUtleXNBc0hlYWRlcnM/T2JqZWN0LmtleXMoQVswXSk6Ti5jb2x1bW5IZWFkZXJzO2xldCBHPVYoVyhcIlwiKSxLKE4pLEwoTiksRShOLGopLE8oTixqLEEpKTtpZih6KEcpLmxlbmd0aDwxKXRocm93IG5ldyBaKFwiT3V0cHV0IGlzIGVtcHR5LiBJcyB5b3VyIGRhdGEgZm9ybWF0dGVkIGNvcnJlY3RseT9cIik7cmV0dXJuIEd9LEl4PSh4KT0+KEEpPT57aWYoIXdpbmRvdyl0aHJvdyBuZXcgJChcIkRvd25sb2FkaW5nIG9ubHkgc3VwcG9ydGVkIGluIGEgYnJvd3NlciBlbnZpcm9ubWVudC5cIik7Y29uc3QgTj1ZKHgpLGo9eihBKSxHPU4udXNlVGV4dEZpbGU/XCJwbGFpblwiOlwiY3N2XCIsSj1OLnVzZVRleHRGaWxlP1widHh0XCI6XCJjc3ZcIjtsZXQgUz1uZXcgQmxvYihbal0se3R5cGU6YHRleHQvJHtHfTtjaGFyc2V0PXV0Zjg7YH0pLEk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7SS5kb3dubG9hZD1gJHtOLmZpbGVuYW1lfS4ke0p9YCxJLmhyZWY9VVJMLmNyZWF0ZU9iamVjdFVSTChTKSxJLnNldEF0dHJpYnV0ZShcInZpc2liaWxpdHlcIixcImhpZGRlblwiKSxkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEkpLEkuY2xpY2soKSxkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKEkpfTtleHBvcnR7WSBhcyBta0NvbmZpZyxHeCBhcyBnZW5lcmF0ZUNzdixJeCBhcyBkb3dubG9hZCx5IGFzIGFzU3RyaW5nfTtcbiIsICJpbXBvcnQgeyBta0NvbmZpZywgZ2VuZXJhdGVDc3YsIGRvd25sb2FkIH0gZnJvbSBcImV4cG9ydC10by1jc3ZcIlxuXG5leHBvcnQgZGVmYXVsdCB7XG4gIG1vdW50ZWQoKSB7XG4gICAgdGhpcy5oYW5kbGVFdmVudChcImdlbmVyYXRlXCIsICh7IGRhdGEgfSkgPT4ge1xuICAgICAgdG9kYXkgPSBuZXcgRGF0ZSgpXG5cbiAgICAgIGNvbnN0IGNzdkNvbmZpZyA9IG1rQ29uZmlnKHsgXG4gICAgICAgIHVzZUtleXNBc0hlYWRlcnM6IHRydWUsXG4gICAgICAgIGZpbGVuYW1lOiBgcGF5bWVudHNfJHt0b2RheS50b0lTT1N0cmluZygpfWBcbiAgICAgIH0pXG5cbiAgICAgIGNvbnN0IGZvcm1hdHRlZERhdGEgPSBkYXRhLm1hcCgocGF5bWVudERhdGEpID0+IHtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVkQmlsbHMgPSBwYXltZW50RGF0YS5iaWxscy5yZWR1Y2UoXG4gICAgICAgICAgKGZvcm1hdHRlZCwgYmlsbCkgPT4gYCR7Zm9ybWF0dGVkfVxcbiR7YmlsbC5uYW1lfToke2JpbGwuYW1vdW50fWAsICcnXG4gICAgICAgIClcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIC4uLnBheW1lbnREYXRhLFxuICAgICAgICAgIGJpbGxzOiBmb3JtYXR0ZWRCaWxsc1xuICAgICAgICB9XG4gICAgICB9KVxuXG4gICAgICBjb25zdCBjc3YgPSBnZW5lcmF0ZUNzdihjc3ZDb25maWcpKGZvcm1hdHRlZERhdGEpXG5cbiAgICAgIGRvd25sb2FkKGNzdkNvbmZpZykoY3N2KVxuICAgIH0pXG4gIH1cbn1cbiIsICJpbXBvcnQgR2VuZXJhdGVDU1YgZnJvbSBcIi4vaG9va3MvZ2VuZXJhdGVDc3ZcIlxuXG5jb25zdCBIb29rcyA9IHtcbiAgR2VuZXJhdGVDU1Y6IEdlbmVyYXRlQ1NWXG59XG5cbmV4cG9ydCBkZWZhdWx0IEhvb2tzXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFNQSxNQUFDLFVBQVUsU0FBUSxXQUFVO0FBQzNCO0FBR0EsUUFBQyxZQUFZO0FBQ1gsY0FBSSxXQUFXO0FBQ2YsY0FBSSxVQUFVLENBQUMsTUFBTSxPQUFPLFVBQVUsR0FBRztBQUN6QyxtQkFBUyxJQUFJLEdBQUcsSUFBSSxRQUFRLFVBQVUsQ0FBQyxRQUFPLHVCQUF1QixFQUFFLEdBQUc7QUFDeEUsb0JBQU8sd0JBQ0wsUUFBTyxRQUFRLEtBQUs7QUFDdEIsb0JBQU8sdUJBQ0wsUUFBTyxRQUFRLEtBQUssMkJBQ3BCLFFBQU8sUUFBUSxLQUFLO0FBQUEsVUFDeEI7QUFDQSxjQUFJLENBQUMsUUFBTztBQUNWLG9CQUFPLHdCQUF3QixTQUFVLFVBQVUsU0FBUztBQUMxRCxrQkFBSSxXQUFXLElBQUksS0FBSyxFQUFFLFFBQVE7QUFDbEMsa0JBQUksYUFBYSxLQUFLLElBQUksR0FBRyxLQUFNLFlBQVcsU0FBUztBQUN2RCxrQkFBSSxLQUFLLFFBQU8sV0FBVyxXQUFZO0FBQ3JDLHlCQUFTLFdBQVcsVUFBVTtBQUFBLGNBQ2hDLEdBQUcsVUFBVTtBQUNiLHlCQUFXLFdBQVc7QUFDdEIscUJBQU87QUFBQSxZQUNUO0FBQ0YsY0FBSSxDQUFDLFFBQU87QUFDVixvQkFBTyx1QkFBdUIsU0FBVSxJQUFJO0FBQzFDLDJCQUFhLEVBQUU7QUFBQSxZQUNqQjtBQUFBLFFBQ0osR0FBRztBQUVILFlBQUksUUFDRixpQkFDQSxhQUNBLGlCQUNBLFNBQ0EsV0FBVyxTQUFVLE1BQU0sTUFBTSxTQUFTO0FBQ3hDLGNBQUksS0FBSztBQUFrQixpQkFBSyxpQkFBaUIsTUFBTSxTQUFTLEtBQUs7QUFBQSxtQkFDNUQsS0FBSztBQUFhLGlCQUFLLFlBQVksT0FBTyxNQUFNLE9BQU87QUFBQTtB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
