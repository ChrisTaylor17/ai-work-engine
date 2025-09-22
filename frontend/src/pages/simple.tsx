import { useState } from 'react';

export default function Simple() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'ai', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', content: 'Sorry, I had an error. Try again!' }]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl mb-6 text-center">CONSILIENCE</h1>
        
        <div className="space-y-4 mb-6 h-96 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`p-3 rounded ${msg.role === 'user' ? 'bg-blue-600 ml-12' : 'bg-gray-700 mr-12'}`}>
              {msg.content}
            </div>
          ))}
          {loading && <div className="bg-gray-700 mr-12 p-3 rounded">Thinking...</div>}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded px-4 py-2 text-white"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-6 py-2 rounded text-white"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}