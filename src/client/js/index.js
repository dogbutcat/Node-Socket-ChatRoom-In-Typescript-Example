/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var wsAddr = 'http://www.raiyku.com';
	var Message = (function () {
	    function Message() {
	        this.username = '';
	        this.userid = '';
	        this.content = '';
	        this.username = '';
	    }
	    return Message;
	}());
	var ChatObj = (function () {
	    function ChatObj() {
	    }
	    return ChatObj;
	}());
	var Chat = (function () {
	    function Chat() {
	    }
	    ;
	    /**
	     * usernameSubmit
	     */
	    Chat.prototype.usernameSubmit = function () {
	        var username = document.getElementById('username').value;
	        if (username) {
	            document.getElementById('username').value = '';
	            document.getElementById('loginbox').style.display = 'none';
	            document.getElementById('chatbox').style.display = 'block';
	            this.init(username);
	        }
	    };
	    Chat.prototype.submit = function () {
	        var contentHtml = document.getElementById('content');
	        var content = contentHtml.value;
	        if (content) {
	            var message = new Message();
	            message.userid = Chat.chatObj.userid;
	            message.username = Chat.chatObj.username;
	            message.content = content;
	            Chat.socket.emit('message', message);
	            contentHtml.value = '';
	        }
	    };
	    Chat.prototype.logout = function () {
	        location.reload();
	    };
	    Chat.prototype.init = function (userName) {
	        var _this = this;
	        Chat.chatObj.userid = this.genUid();
	        Chat.chatObj.username = userName;
	        document.getElementById('showusername').innerHTML = Chat.chatObj.username;
	        this.scrollToBottom(Chat.msgObj);
	        Chat.socket.emit('login', Chat.chatObj);
	        Chat.socket.on('login', function (o) { _this.updateSysMsg(o, 'login'); });
	        Chat.socket.on('logout', function (o) { _this.updateSysMsg(o, 'logout'); }); // UnUsed
	        Chat.socket.on('message', function (o) {
	            var isself = (o.userid == Chat.chatObj.userid) ? true : false;
	            var contentDiv = '<div>' + o.content + "</div>";
	            var usernameDiv = '<span>' + o.username + '</span>';
	            var section = document.createElement('section');
	            isself ? (section.className = 'user', section.innerHTML = contentDiv + usernameDiv)
	                : (section.className = 'service', section.innerHTML = usernameDiv + contentDiv);
	            Chat.msgObj.appendChild(section);
	            _this.scrollToBottom(Chat.msgObj);
	        });
	    };
	    Chat.prototype.genUid = function () {
	        return new Date() + '' + Math.floor(Math.random() * 1899 + 100);
	    };
	    Chat.prototype.scrollToBottom = function (obj) {
	        scrollTo(0, obj.clientHeight);
	    };
	    Chat.prototype.updateSysMsg = function (obj, action) {
	        var onlineUsers = obj.onlineUsers;
	        var onlineCount = obj.onlineCount;
	        var user = obj.user;
	        var userhtml = '';
	        var count = 0;
	        for (var key in onlineUsers) {
	            ++count ? (userhtml += '') : (userhtml += ',');
	            userhtml += onlineUsers[key];
	        }
	        document.getElementById('onlinecount').innerHTML = '当前共有 ' + onlineCount + ' 人在线，在线列表：' + userhtml;
	        var html = '';
	        html += '<div class="msg-system">';
	        html += user.username;
	        html += (action == 'login') ? ' 加入了聊天室' : ' 退出了聊天室';
	        html += '</div>';
	        var section = document.createElement('section');
	        section.className = 'system J-mjrlinkWrap J-cutMsg';
	        section.innerHTML = html;
	        Chat.msgObj.appendChild(section);
	        this.scrollToBottom(Chat.msgObj);
	    };
	    Chat.msgObj = document.getElementById('message');
	    Chat.chatObj = new ChatObj();
	    Chat.socket = io.connect(wsAddr);
	    return Chat;
	}());
	window.Chat = window.Chat || new Chat();


/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map