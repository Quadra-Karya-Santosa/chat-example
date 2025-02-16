type ChatHeaderProps = {
  username: string;
}
const ChatHeader = ({ username }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b">
      <h2 className="text-xl font-semibold">Chat Room</h2>
      <p className="text-sm text-gray-500">Logged in as {username}</p>
    </div>
  )
}

export default ChatHeader