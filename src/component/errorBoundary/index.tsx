import React from 'react'

interface ErrorBoundaryProps {
    children: React.ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

// React 错误边界组件: 捕获子组件树中的渲染阶段错误, 防止整个应用白屏
class ErrorBoundary extends React.Component<
    ErrorBoundaryProps,
    ErrorBoundaryState
> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('[ErrorBoundary] 捕获到渲染错误:', error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        padding: '24px',
                        fontFamily:
                            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    }}
                >
                    <h2 style={{ marginBottom: '12px' }}>页面出现了一些问题</h2>
                    <p
                        style={{
                            color: '#888',
                            marginBottom: '24px',
                            textAlign: 'center',
                        }}
                    >
                        {this.state.error?.message ?? '未知错误'}
                    </p>
                    <button
                        onClick={this.handleReset}
                        style={{
                            padding: '8px 24px',
                            cursor: 'pointer',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px',
                            background: '#fff',
                        }}
                    >
                        重试
                    </button>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary
