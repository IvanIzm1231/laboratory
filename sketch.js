let xPos = 420; 
let yPos = 340; 
let isMovingRight = false;
let isMovingLeft = false;
let isJumping = false;
let jumpSpeed = 0;
let gravity = 1;
let facingRight = true; 
let bird; 
let canyons = []; 
let character; 

class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60; 
        this.height = 70; 
        this.handLength = 50; 
        this.legLength = 50; 
    }

    move() {
        let newX = this.x;
        if (isMovingRight) {
            newX += 5; 
            facingRight = true; 
        }
        if (isMovingLeft) {
            newX -= 5; 
            facingRight = false;
        }

        
        this.x = constrain(newX, 0, width - this.width);
    }

    jump() {
        if (isJumping) {
            this.y -= jumpSpeed;
            jumpSpeed -= gravity;
            if (this.y >= 340) {
                // если персонаж на земле
                this.y = 340;
                isJumping = false;
                jumpSpeed = 0;
            }
        }
    }

    display() {
      
        push();
        translate(this.x + this.width / 2, this.y + this.height / 2); 
        if (facingRight) {
            scale(-1, 1);
        }

       
        fill(0, 102, 204); 
        rect(-this.width / 2, -this.height / 2, this.width, this.height); 

        
        fill(255, 224, 189); 
        rect(-this.width / 2 + 5, -this.height / 2 - 50, this.width - 10, 50);

        this.displayLegs();
        this.displayArms();

        
        fill(0);
        if (facingRight) {
            ellipse(-this.width / 2 + 10, -this.height / 2 - 35, 5, 5); 
            ellipse(-this.width / 2 + 30, -this.height / 2 - 35, 5, 5); 
        } else {
            ellipse(-this.width / 2 + 30, -this.height / 2 - 35, 5, 5); 
            ellipse(-this.width / 2 + 10, -this.height / 2 - 35, 5, 5); 
        }

        pop();
    }

    displayLegs() {
        stroke("#000000");
        strokeWeight(2);
        fill(0, 102, 204); 
        let legOffset = isJumping ? -10 : 0; 
        
        
        line(-this.width / 2, this.height / 2, -this.width / 2 - 10, this.height / 2 + this.legLength + legOffset); 
        line(this.width / 2, this.height / 2, this.width / 2 + 10, this.height / 2 + this.legLength + legOffset); 
    }

    displayArms() {
        stroke("#000000");
        strokeWeight(2);
        fill(0, 102, 204); 
        let armSwing = isMovingRight || isMovingLeft ? 5 : 0; 
        
        // Отрисовка рук
        line(-this.width / 2, -this.height / 2 + 10, -this.handLength - armSwing, -this.height / 2 + 20); 
        line(this.width / 2, -this.height / 2 + 10, this.handLength + armSwing, -this.height / 2 + 20); 
    }
}

class Canyon {
    constructor(x, y, width, height) {
        this.x = x + 300;
        this.y = y - 80;
        this.width = width ;
        this.height = height + 80;
    }
 display() {
        fill(0, 0, 0);
        rect(this.x, this.y, this.width, this.height);
    }

    checkCollision(character) {
        if (character.y + character.height > this.y && character.x + character.width > this.x && character.x < this.x + this.width) {
            
            isFalling = true; 
            character.y = this.y + this.height; 
        }
    }
}

class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = random(1, 3);
        this.direction = random([-1, 1]); 
        this.isFalling = false; 
    }

    move() {
        if (!this.isFalling) {
            this.x += this.speed * this.direction;

            // Проверка на границы
            if (this.x < 0 || this.x > width) {
                this.direction *= -1; 
            }

           
            this.y += random(-0.2, 0.2);
            this.y = constrain(this.y, 50, height - 50); 
        } else {
            // Птица падает
            this.y += 5; 
            this.y = constrain(this.y, 432, height - 30); 
        }
    }
    display() {
       
        fill(0); 
        rect(this.x, this.y, 30, 30);

        
        fill(255, 255, 0);
        if (this.direction > 0) {
            
            triangle(this.x + 30, this.y + 10, this.x + 30, this.y + 20, this.x + 40, this.y + 15); 
        } else {
            
            triangle(this.x, this.y + 10, this.x, this.y + 20, this.x - 10, this.y + 15); 
        }

        
        if (this.isFalling) {
            fill(255, 255, 0); 
            if (this.direction > 0) {
                triangle(this.x + 10, this.y + 30, this.x + 20, this.y + 40, this.x + 10, this.y + 40);
            } else {
                triangle(this.x + 20, this.y + 30, this.x + 10, this.y + 40, this.x + 20, this.y + 40); 
            }
        }
    }

    fall() {
        this.isFalling = true; 
    }
}

function setup() {
    createCanvas(1050, 550);
    character = new Character(xPos, yPos); 
    bird = new Bird(random(width), random(50, 200));
    canyons.push(new Canyon(300, 500, 150, 50));
}

function draw() {
    background(122, 160, 260);

    drawGround();

    drawEnvironment(); 

        for (let canyon of canyons) {
        canyon.display();
        canyon.checkCollision(character);
    }
    
    character.move();
    character.jump();
    character.display();

    bird.move();
    bird.display();
    

}

function drawGround() {
    noStroke();
    fill(0, 155, 0);
    rect(0, 432, width, 118);
}

function drawEnvironment() {
    noStroke();
    fill(255);
    ellipse(600, 190, 90, 75);
    ellipse(650, 210, 75, 55); 
    ellipse(550, 210, 75, 55); 

    noStroke();
    fill(90);
    triangle(80, 432, 200, 90, 350, 432); // гора 1
    fill(110);
    triangle(180, 432, 290, 100, 380, 432); // гора 2

    noStroke();
    fill(218, 165, 32);
    ellipse(100, 150, 120, 120);
}

function keyPressed() {
    if (keyCode === 68) { 
        isMovingRight = true;
    }
    if (keyCode === 65) {
        isMovingLeft = true;
    }
    if (keyCode === 32) {
        if (!isJumping) {
            // прыжок
            isJumping = true;
            jumpSpeed = 15;
        }
    }
    if (keyCode === 70) { 
        bird.fall();
    }
}

function keyReleased() {
    if (keyCode === 68) { 
        isMovingRight = false;
    }
    if (keyCode === 65) {
        isMovingLeft = false; 
    }
}