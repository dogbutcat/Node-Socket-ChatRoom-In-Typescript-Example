let wsAddr = 'http://www.raiyku.com';

interface Window{
    Chat:any;
}

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

class Chat {
    static msgObj = document.getElementById('message');
    static chatObj = new ChatObj();;
    static socket = io.connect(wsAddr);

    constructor(){}

    /**
     * usernameSubmit
     */
    public usernameSubmit() {
        var username = (<HTMLInputElement>document.getElementById('username')).value;
        if(username){
            (<HTMLInputElement>document.getElementById('username')).value='';
            document.getElementById('loginbox').style.display = 'none';
            document.getElementById('chatbox').style.display = 'block';
            this.init(username);
        }
    }

    public submit(){
        var contentHtml = <HTMLInputElement>document.getElementById('content');
        var content = contentHtml.value;
        if(content){
            var message = new Message();
            message.userid= Chat.chatObj.userid;
            message.username = Chat.chatObj.username;
            message.content = content;
            Chat.socket.emit('message',message);
            contentHtml.value = '';
        }
    }

    public logout(){
        location.reload();
    }

    private init(userName) {
        Chat.chatObj.userid = this.genUid();
        Chat.chatObj.username = userName;

        document.getElementById('showusername').innerHTML = Chat.chatObj.username;
        this.scrollToBottom(Chat.msgObj);

        Chat.socket.emit('login', Chat.chatObj);

        Chat.socket.on('login', (o) => { this.updateSysMsg(o, 'login') });

        Chat.socket.on('logout', (o) => { this.updateSysMsg(o, 'logout') }); // UnUsed

        Chat.socket.on('message', (o: IMessage) => {
            var isself = (o.userid == Chat.chatObj.userid) ? true : false;
            var contentDiv = '<div>' + o.content + "</div>";
            var usernameDiv = '<span>' + o.username + '</span>';

            var section = document.createElement('section');
            isself ? (section.className = 'user', section.innerHTML = contentDiv + usernameDiv)
                : (section.className = 'service', section.innerHTML = usernameDiv + contentDiv);
            Chat.msgObj.appendChild(section);
            this.scrollToBottom(Chat.msgObj);
        })
    }

    private genUid() {
        return new Date() + '' + Math.floor(Math.random() * 1899 + 100);
    }

    private scrollToBottom(obj: HTMLElement) {
        scrollTo(0, obj.clientHeight);
    }

    private updateSysMsg(obj: IOnlineInfo, action) {
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
    }
}

window.Chat = window.Chat|| new Chat();