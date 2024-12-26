

let xPos = 420; // начальная позиция персонажа по оси X
let yPos = 340; // начальная позиция персонажа по оси Y
let isMovingRight = false;
let isMovingLeft = false;
let isJumping = false;
let jumpSpeed = 0;
let gravity = 1;
let facingRight = true; // направление, в котором смотрит персонаж
let bird; // переменная для птицы


// Класс для персонажа
class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60; // ширина тела
        this.height = 70; // высота тела
        this.handLength = 50; // длина рук
        this.legLength = 50; // длина ног
    }

    move() {
        let newX = this.x;
        if (isMovingRight) {
            newX += 5; // движение вправо
            facingRight = true; // поворот вправо
        }
        if (isMovingLeft) {
            newX -= 5; // движение влево
            facingRight = false; // поворот влево
        }

        // Ограничение по X в пределах холста
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
        // Поворот персонажа
        push();
        translate(this.x + this.width / 2, this.y + this.height / 2); // центр поворота
        if (facingRight) {
            scale(-1, 1); // перевернуть
        }

        // Отрисовка тела
        fill(0, 102, 204); // цвет одежды
        rect(-this.width / 2, -this.height / 2, this.width, this.height); // тело

        // Отрисовка головы
        fill(255, 224, 189); // цвет кожи
        rect(-this.width / 2 + 5, -this.height / 2 - 50, this.width - 10, 50); // голова

        this.displayLegs(); // отображаем ноги
        this.displayArms(); // отображаем руки

        // Отрисовка глаз
        fill(0); // цвет глаз
        if (facingRight) {
            ellipse(-this.width / 2 + 10, -this.height / 2 - 35, 5, 5); // левый глаз
            ellipse(-this.width / 2 + 30, -this.height / 2 - 35, 5, 5); // правый глаз
        } else {
            ellipse(-this.width / 2 + 30, -this.height / 2 - 35, 5, 5); // левый глаз
            ellipse(-this.width / 2 + 10, -this.height / 2 - 35, 5, 5); // правый глаз
        }

        pop(); // восстановить состояние
    }

    displayLegs() {
        stroke("#000000");
        strokeWeight(2);
        fill(0, 102, 204); // цвет ног
        let legOffset = isJumping ? -10 : 0; // смещение ног при прыжке
        
        // Отрисовка ног
        line(-this.width / 2, this.height / 2, -this.width / 2 - 10, this.height / 2 + this.legLength + legOffset); // левая нога
        line(this.width / 2, this.height / 2, this.width / 2 + 10, this.height / 2 + this.legLength + legOffset); // правая нога
    }

    displayArms() {
        stroke("#000000");
        strokeWeight(2);
        fill(0, 102, 204); // цвет рук
        let armSwing = isMovingRight || isMovingLeft ? 5 : 0; // легкое движение рук при движении
        
        // Отрисовка рук
        line(-this.width / 2, -this.height / 2 + 10, -this.handLength - armSwing, -this.height / 2 + 20); // левая рука
        line(this.width / 2, -this.height / 2 + 10, this.handLength + armSwing, -this.height / 2 + 20); // правая рука
    }
}

// Класс для птицы
class Bird {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = random(1, 3);
        this.direction = random([-1, 1]); // -1 или 1 для движения влево или вправо
        this.isFalling = false; // состояние птицы
    }

    move() {
        if (!this.isFalling) {
            this.x += this.speed * this.direction;

            // Проверка на границы
            if (this.x < 0 || this.x > width) {
                this.direction *= -1; // поменять направление
            }

            // Птица немного изменяет свою позицию по Y для более естественного движения
            this.y += random(-0.2, 0.2);
            this.y = constrain(this.y, 50, height - 50); // ограничение по Y
        } else {
            // Птица падает
            this.y += 5; // скорость падения
            this.y = constrain(this.y, 432, height - 30); // фиксируем на уровне земли
        }
    }

    display() {
        // Отрисовка тела птицы
        fill(0); // черный цвет для тела
        rect(this.x, this.y, 30, 30); // тело птицы

        // Отрисовка клюва
        fill(255, 255, 0); // желтый цвет для клюва
        if (this.direction > 0) {
            // Если летит вправо
            triangle(this.x + 30, this.y + 10, this.x + 30, this.y + 20, this.x + 40, this.y + 15); // клюв
        } else {
            // Если летит влево
            triangle(this.x, this.y + 10, this.x, this.y + 20, this.x - 10, this.y + 15); // клюв
        }

        // Если птица падает, клюв будет направлен вниз
        if (this.isFalling) {
            fill(255, 255, 0); // желтый цвет для клюва
            if (this.direction > 0) {
                triangle(this.x + 10, this.y + 30, this.x + 20, this.y + 40, this.x + 10, this.y + 40); // клюв вниз вправо
            } else {
                triangle(this.x + 20, this.y + 30, this.x + 10, this.y + 40, this.x + 20, this.y + 40); // клюв вниз влево
            }
        }
    }

    fall() {
        this.isFalling = true; // активируем состояние падения
    }
}

// Переменные для персонажа и птицы
let character;

function setup() {
    createCanvas(1050, 550);
    character = new Character(xPos, yPos); // создание персонажа
    bird = new Bird(random(width), random(50, 200)); // создание птицы
}

function draw() {
    background(122, 160, 260); // заполнить небо голубым

    // Рисуем землю
    drawGround();

    // Объекты окружающей среды
    drawEnvironment(); 

    // Обновляем и отображаем персонажа
    character.move();
    character.jump();
    character.display();

    // Обновляем и отображаем птицу
    bird.move();
    bird.display();
}

function drawGround() {
    noStroke();
    fill(0, 155, 0);
    rect(0, 432, width, 118); // нарисовать зеленую землю
}

function drawEnvironment() {
    noStroke();
    fill(255);
    ellipse(600, 190, 90, 75); // облако 1
    ellipse(650, 210, 75, 55); // облако 2
    ellipse(550, 210, 75, 55); // облако 3

    noStroke();
    fill(90);
    triangle(80, 432, 200, 90, 350, 432); // гора 1
    fill(110);
    triangle(180, 432, 290, 100, 380, 432); // гора 2

    noStroke();
    fill(218, 165, 32); // цвет солнца
    ellipse(100, 150, 120, 120); // солнце
}

function keyPressed() {
    if (key === "d") {
        isMovingRight = true; // движение вправо
    }
    if (key === "a") {
        isMovingLeft = true; // движение влево
    }
    if (key === " ") {
        if (!isJumping) {
            // прыжок
            isJumping = true;
            jumpSpeed = 15; // начальная скорость прыжка
        }
    }
    if (key === "f") {
        // нажатие кнопки F
        bird.fall(); // заставляем птицу падать
    }
}

function keyReleased() {
    if (key === "d") {
        isMovingRight = false; // остановка движения вправо
    }
    if (key === "a") {
        isMovingLeft = false; // остановка движения влево
    }
}

// Функция для проверки коллизий
function isColliding(newX, newY) {
    // Проверка коллизий с облаками и горами
    if (
        (newY < 200 && newX < 500 && newX + 40 > 580) || // облака
        (newY < 100 && newX < 250 && newX + 40 > 350) // гора
    ) {
        return true; // есть коллизия
    }
    return false; // коллизий нет
}
