class ChatService {

    static printMessage(message, color = null) {
        const chat = document.getElementById("chat");
        
        const li = document.createElement("li");
    
        const now = new Date();
    
        const hours = now.getHours(), minutes = now.getMinutes();
    
        li.textContent = "[" + hours + ":" + (minutes < 10 ? "0" + minutes : minutes) + "] " + message;
        li.style.color = color ? color : "#eee";
    
        chat.append(li);
    
        chat.scroll({
            top: 9999
        })
    }

}

export default ChatService;