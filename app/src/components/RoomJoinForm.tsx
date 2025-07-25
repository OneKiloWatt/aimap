// src/components/RoomJoinForm.tsx
import React, { useState } from 'react';
import './RoomJoinForm.css';
import { nicknameList } from '../constants/nicknameList';
import { joinRoom } from '../api/joinRoom';

type Props = {
  roomId: string;
  onSubmit: (nickname: string) => void;
  onError?: (error: string) => void;
};

export default function RoomJoinForm({ roomId, onSubmit, onError }: Props) {
  const [step, setStep] = useState(1);
  const [nickname, setNickname] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  // レンダリング確認用（デバッグ）
  console.log('📝 RoomJoinForm レンダリング実行中', {
    roomId,
    step,
    nickname: nickname.substring(0, 3) + '...'
  });

  const handleNext = () => {
    if (!nickname.trim()) {
      setError('ニックネームを入力してね');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!agreed) {
      setError('利用規約への同意が必要です');
      return;
    }

    setError(''); // エラーをクリア
    
    try {
      // joinRoom API を呼び出し
      const result = await joinRoom(roomId, nickname);
      
      if (result.success) {
        console.log('ルーム参加成功:', result);
        onSubmit(nickname); // 成功時は親に通知
      } else {
        console.error('ルーム参加失敗:', result.error);
        setError(result.error);
        
        // 親コンポーネントにもエラーを通知（オプション）
        if (onError) {
          onError(result.error);
        }
      }
    } catch (error) {
      console.error('ルーム参加処理中エラー:', error);
      const errorMessage = '参加処理中にエラーが発生しました';
      setError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleRandomGenerate = () => {
    const random = nicknameList[Math.floor(Math.random() * nicknameList.length)];
    setNickname(random);
    setError('');
  };

  return (
    <div className="room-join-form-overlay">
      <div className="room-join-form-container">
        
        {step === 1 ? (
          <>
            <div className="app-subtitle">🔍 友達と位置をシェアできるアプリ</div>
            <h2>あえるまっぷへようこそ</h2>
            
            <div className="welcome-message">
              <p>友達から位置共有のルームに招待されたよ！</p>
              <p>ニックネームを入力して参加すると、お互いの場所がリアルタイムで見えるようになるよ✨</p>
            </div>
            
            <div className="location-notice">
              ※このルームに参加すると、あなたの現在地が他の参加者にリアルタイムで表示されます。
            </div>

            <div className="input-with-button">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="ニックネームを入れてね"
              />
              <button onClick={handleRandomGenerate}>🎲</button>
            </div>
            
            <p className="privacy-notice">
              ※プライバシー保護のため、本名や個人を特定できる名前は避けてください
            </p>

            {error && <div className="error-message">{error}</div>}

            <div className="button-row">
              <button onClick={handleNext}>次へ</button>
            </div>
          </>
        ) : (
          <>
            <h2>⚠️ この招待、知ってる人から送られてきた？</h2>
            
            <div className="warning-content">
              <p>
                <strong>このページのリンクが信頼できる人から送られたものでなければ、参加しないでね！</strong>
              </p>
              <p>
                このルームでは、あなたの現在地がリアルタイムで共有されるよ〜
              </p>
              <p>
                詳しくは<a href="/terms" target="_blank" rel="noopener noreferrer">利用規約</a>へ。
              </p>
            </div>

            <div className="agreement-section">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                />
                上記に同意する
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-row">
              <button 
                onClick={handleSubmit}
                disabled={!agreed}
                className={!agreed ? 'disabled' : ''}
              >
                参加する
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
