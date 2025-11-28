import React from 'react';

type State = { hasError: boolean };

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    if (import.meta.env.DEV) {
      console.error('Render error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">!</div>
            <h1 className="text-xl font-bold mb-2">页面出现错误</h1>
            <p className="text-sm text-gray-600 mb-4">请刷新页面或返回首页。</p>
            <div className="flex gap-3 justify-center">
              <button className="px-4 py-2 bg-[#4CAF50] text-white rounded" onClick={() => location.reload()}>刷新页面</button>
              <a href="/" className="px-4 py-2 border border-gray-300 rounded">返回首页</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

