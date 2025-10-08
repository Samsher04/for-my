let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // Desktop mouse move
    document.addEventListener('mousemove', (e) => {
      if(!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX*dirX+dirY*dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;
      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = 180 * angle / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if(this.rotating) this.rotation = degrees;

      if(this.holdingPaper && !this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }

      if(this.holdingPaper) {
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    // Desktop mouse down
    paper.addEventListener('mousedown', (e) => {
      if(this.holdingPaper) return;
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      if(e.button === 0) {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
      if(e.button === 2) this.rotating = true;
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Mobile touch events
    paper.addEventListener('touchstart', (e) => {
      e.preventDefault(); // prevent scrolling/selecting
      const touch = e.touches[0];
      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;
    });

    paper.addEventListener('touchmove', (e) => {
      if(!this.holdingPaper) return;
      const touch = e.touches[0];
      const velX = touch.clientX - this.prevMouseX;
      const velY = touch.clientY - this.prevMouseY;
      this.currentPaperX += velX;
      this.currentPaperY += velY;
      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    });

    paper.addEventListener('touchend', () => {
      this.holdingPaper = false;
    });
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));
papers.forEach(paper => {
  const p = new Paper();
  p.init(paper);
});
