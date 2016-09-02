interface Window {
    Chat: any;
}
module Chat {
    let wsAddr = 'http://www.raiyku.com';


    interface IOnlineUsers {
        userid: string;
        username: string;
    }

    interface IChatObj {
        userid: string;
        username: string;
    }

    interface IOnlineInfo {
        onlineUsers: IOnlineUsers;
        onlineCount: number;
        user: IChatObj;
    }

    interface IMessage {
        username: string;
        userid: string;
        content: string;
    }

    class Message implements IMessage {
        username: string = '';
        userid: string;
        content: string;
        constructor() {
            this.userid = '';
            this.content = '';
            this.username = '';
        }

    }

    class ChatObj implements IChatObj {
        userid: string;
        username: string;
        constructor() {
        }
    }

    let msgObj = document.getElementById('message');
    let chatObj = new ChatObj();;
    let socket = io.connect(wsAddr);

    /**
     * usernameSubmit
     */
    export function usernameSubmit() {
        var username = (<HTMLInputElement>document.getElementById('username')).value;
        if (username) {
            (<HTMLInputElement>document.getElementById('username')).value = '';
            document.getElementById('loginbox').style.display = 'none';
            document.getElementById('chatbox').style.display = 'block';
            init(username);
        }
    }

    export function submit() {
        var contentHtml = <HTMLInputElement>document.getElementById('content');
        var content = contentHtml.value;
        if (content) {
            var message = new Message();
            message.userid = chatObj.userid;
            message.username = chatObj.username;
            message.content = content;
            socket.emit('message', message);
            contentHtml.value = '';
        }
    }

    export function logout() {
        location.reload();
    }

    function init(userName) {
        chatObj.userid = genUid();
        chatObj.username = userName;

        document.getElementById('showusername').innerHTML = chatObj.username;
        scrollToBottom(msgObj);

        socket.emit('login', chatObj);

        socket.on('login', (o) => { updateSysMsg(o, 'login') });

        socket.on('logout', (o) => { updateSysMsg(o, 'logout') }); // UnUsed

        socket.on('message', (o: IMessage) => {
            var isself = (o.userid == chatObj.userid) ? true : false;
            var contentDiv = '<div>' + o.content + "</div>";
            var usernameDiv = '<span>' + o.username + '</span>';

            var section = document.createElement('section');
            isself ? (section.className = 'user', section.innerHTML = contentDiv + usernameDiv)
                : (section.className = 'service', section.innerHTML = usernameDiv + contentDiv);
            msgObj.appendChild(section);
            scrollToBottom(msgObj);
        })
    }

    function genUid() {
        return new Date().toString() + Math.floor(Math.random() * 1899 + 100);
    }

    function scrollToBottom(obj: HTMLElement) {
        scrollTo(0, obj.clientHeight);
    }

    function updateSysMsg(obj: IOnlineInfo, action) {
        var onlineUsers = obj.onlineUsers;
        var onlineCount = obj.onlineCount;
        var user = obj.user;

        var userhtml = '';
        var count = 0;
        for (var key in onlineUsers) {
            count++ ? (userhtml += ',') : (userhtml += '');
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
        msgObj.appendChild(section);
        scrollToBottom(msgObj);
    }
}

window.Chat = window.Chat || Chat;