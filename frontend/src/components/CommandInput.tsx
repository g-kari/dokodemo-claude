import React, { useState, useRef, useEffect } from 'react';

interface CommandInputProps {
  onSendCommand: (command: string) => void;
  onSendArrowKey?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  disabled?: boolean;
}

const CommandInput: React.FC<CommandInputProps> = ({ onSendCommand, onSendArrowKey, disabled = false }) => {
  const [command, setCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendCommand = () => {
    if (disabled) return;

    if (command.trim()) {
      // コマンドが入力されている場合：通常のコマンド送信
      // コマンド履歴に追加
      setCommandHistory(prev => [...prev, command]);
      setHistoryIndex(-1);

      // コマンド送信
      onSendCommand(command);
      setCommand('');
    } else {
      // コマンドが入力されていない場合：エンターキーを送信
      onSendCommand('\r');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendCommand();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter または Cmd+Enter で送信
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendCommand();
      return;
    }

    // 上下キーでコマンド履歴をナビゲート
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex < commandHistory.length) {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  // フォーカスを自動で設定
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        <div>
          <textarea
            ref={inputRef}
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              disabled
                ? "リポジトリを選択してください..."
                : "Claude CLIへの指示を入力してください"
            }
            className="w-full px-3 py-2.5 sm:py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none text-sm sm:text-base"
            rows={3}
            disabled={disabled}
          />
          
          {/* ヘルプテキスト - 入力欄のすぐ下 */}
          <div className="mt-2 text-xs text-gray-500">
            {disabled ? (
              "サーバーに接続してリポジトリを選択してください"
            ) : (
              <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                    Ctrl
                  </kbd>
                  <span>+</span>
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                    Enter
                  </kbd>
                  <span>で送信</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">
                    ↑↓
                  </kbd>
                  <span>で履歴</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col space-y-3">
          {/* 方向キーとEnterボタンを横並びに配置 */}
          <div className="flex items-center justify-center space-x-4">
            {/* 方向キーボタン */}
            {onSendArrowKey && (
              <div className="flex flex-col items-center space-y-2">
                <div className="text-xs text-gray-600 font-medium">方向キー</div>
                <div className="grid grid-cols-3 gap-1">
                  <div></div>
                  <button
                    type="button"
                    onClick={() => onSendArrowKey('up')}
                    disabled={disabled}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 touch-manipulation"
                    title="上キー"
                  >
                    ↑
                  </button>
                  <div></div>
                  <button
                    type="button"
                    onClick={() => onSendArrowKey('left')}
                    disabled={disabled}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 touch-manipulation"
                    title="左キー"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendArrowKey('down')}
                    disabled={disabled}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 touch-manipulation"
                    title="下キー"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => onSendArrowKey('right')}
                    disabled={disabled}
                    className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed rounded border text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 touch-manipulation"
                    title="右キー"
                  >
                    →
                  </button>
                </div>
              </div>
            )}

            {/* 送信ボタン */}
            <div className="flex flex-col items-center space-y-2">
              <div className="text-xs text-gray-600 font-medium">実行</div>
              <button
                type="submit"
                disabled={disabled}
                className="bg-blue-600 text-white px-6 py-2.5 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium min-h-[2.5rem] sm:min-h-[2rem] flex items-center touch-manipulation"
              >
                {command.trim() ? '送信' : 'Enter'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CommandInput;