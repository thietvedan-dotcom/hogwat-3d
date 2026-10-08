export class Ambience {
  constructor(){this.enabled=false;this.context=null;this.master=null;}
  async toggle(){
    if(!this.context){
      const AudioContext=window.AudioContext||window.webkitAudioContext;if(!AudioContext)return false;
      this.context=new AudioContext();this.master=this.context.createGain();this.master.gain.value=0;this.master.connect(this.context.destination);
      const buffer=this.context.createBuffer(1,this.context.sampleRate*4,this.context.sampleRate),data=buffer.getChannelData(0);let last=0;
      for(let i=0;i<data.length;i++){const white=Math.random()*2-1;last=(last+.025*white)/1.025;data[i]=last*2.5;}
      const noise=this.context.createBufferSource();noise.buffer=buffer;noise.loop=true;const filter=this.context.createBiquadFilter();filter.type='lowpass';filter.frequency.value=430;noise.connect(filter);filter.connect(this.master);noise.start();
      for(const [freq,volume] of [[73.42,.035],[110,.021],[146.83,.012],[220,.009]]){const oscillator=this.context.createOscillator();oscillator.type='sine';oscillator.frequency.value=freq;const gain=this.context.createGain();gain.gain.value=volume;oscillator.connect(gain);gain.connect(this.master);oscillator.start();}
    }
    await this.context.resume();this.enabled=!this.enabled;this.master.gain.setTargetAtTime(this.enabled?.38:0,this.context.currentTime,.8);return this.enabled;
  }
  chime(){if(!this.enabled||!this.context)return;const now=this.context.currentTime;for(const [i,f] of [293.66,440,587.33,880].entries()){const o=this.context.createOscillator(),g=this.context.createGain();o.type='sine';o.frequency.value=f;o.connect(g);g.connect(this.master);g.gain.setValueAtTime(0,now+i*.12);g.gain.linearRampToValueAtTime(.15,now+i*.12+.02);g.gain.exponentialRampToValueAtTime(.001,now+2+i*.12);o.start(now+i*.12);o.stop(now+2.1+i*.12);}}
}
