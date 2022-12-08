import './App.css'
import {Component} from "react";

const audio = document.getElementById('beep');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breakCount: 5,
            sessionCount: 25,
            secondsCount: 1500,
            status: 'Session',
            isPlaying: false
        };
        this.interval = null;
    }

    handleCount(count, type) {
        const {breakCount, sessionCount, status, isPlaying} = this.state;

        let newCount;

        if(type === 'session') {
            newCount = sessionCount + count;
        } else {
            newCount = breakCount + count;
        }

        if(newCount > 0 && newCount <= 60 && !isPlaying) {
            this.setState({
                [`${type}Count`]: newCount
            })

            if(status.toLowerCase() === type) {
                this.setState({
                    secondsCount: newCount * 60
                })
            }
        }
    }

    resetTimer() {
        this.setState({
            breakCount: 5,
            sessionCount: 25,
            secondsCount: 1500,
            status: 'Session',
            isPlaying: false
        })
        clearInterval(this.interval);

        audio.pause();
        audio.currentTime = 0;
    }

    startTimer() {
        const {isPlaying} = this.state;

        this.setState({
            isPlaying: !isPlaying,
        })

        if (isPlaying) {
            clearInterval(this.interval);
        } else {
            this.interval = setInterval(() => {
                const {breakCount, sessionCount, secondsCount, status} = this.state;

                if (secondsCount === 0) {
                    this.setState({
                        status: status === 'Session' ? 'Break' : 'Session',
                        secondsCount: status === 'Session' ? breakCount * 60 : sessionCount * 60,
                    })

                    audio.play();
                } else {
                    this.setState((prevState) => ({
                        secondsCount: prevState.secondsCount - 1
                    }))
                }
            }, 1000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.loop);
    }

    convertTime(count) {
        let min = Math.floor(count / 60);
        let seconds = Math.floor(count % 60);

        min = min < 10 ? `0${min}` : min;
        seconds = seconds < 10 ? `0${seconds}` : seconds;

        return `${min}:${seconds}`
    }

    render() {
        const {breakCount, sessionCount, secondsCount, status} = this.state;

        return (
            <div className="App">
                <h1 className="mb-5">25 + 5 Clock</h1>
                <div className="flex justify-around gap-3 mb-5">
                    <div className="flex flex-col items-center">
                        <h3 className="w-max text-center mb-2" id="break-label">Break Length</h3>
                        <div className="flex">
                            <button onClick={() => this.handleCount(-1, 'break')} id="break-decrement">-1</button>
                            <div className="flex items-center text-4xl px-5" id="break-length">{breakCount}</div>
                            <button onClick={() => this.handleCount(1, 'break')} id="break-increment">+1</button>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <h3 className="w-max text-center mb-2" id="session-label">Session Length</h3>
                        <div className="flex">
                            <button onClick={() => this.handleCount(-1, 'session')} id="session-decrement">-1</button>
                            <div className="flex items-center text-4xl px-5 text-center" id="session-length">{sessionCount}</div>
                            <button onClick={() => this.handleCount(1, 'session')} id="session-increment">+1</button>
                        </div>
                    </div>
                </div>
                <div className="border-2 rounded-2xl p-2 mb-5">
                    <h3 id="timer-label">{status}</h3>
                    <div className="text-6xl" id="time-left">{this.convertTime(secondsCount)}</div>
                </div>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => this.startTimer()} id="start_stop">Play/Stop</button>
                    <button onClick={() => this.resetTimer()} id="reset">Reset</button>
                </div>
            </div>
        );
    }
}

export default App
