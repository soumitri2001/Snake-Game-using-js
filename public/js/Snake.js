export default class Snake {
    constructor(scene) {
        this.scene = scene;
        this.lastMoveTime = 0;
        this.moveInterval = 230;
        this.tileSize = 16;
        this.direction = Phaser.Math.Vector2.DOWN; // vector for direction

        this.body = []; // array of boxes i.e. the snake
        this.body.push(this.scene.add
            .rectangle(this.scene.game.config.width / 2,
                this.scene.game.config.width / 2,
                this.tileSize, this.tileSize, 0x0000ff)
            .setOrigin(0));
        // this.body.push(this.scene.add.rectangle(0, 0, 16, 16, 0x00f0f0).setOrigin(0));
        // this.body.push(this.scene.add.rectangle(0, 0, 16, 16, 0x0000ff).setOrigin(0));
        // this.body.push(this.scene.add.rectangle(0, 0, 16, 16, 0xff0000).setOrigin(0));

        // adding apples to the scene 
        this.apple = this.scene.add
            .rectangle(0, 0, this.tileSize, this.tileSize, 0x00ff00)
            .setOrigin(0);
        this.positionApple(); // putting apple at random position

        // enabling keyboard inputs
        scene.input.keyboard.on('keydown', e => {
            this.keydown(e);
        });
    }

    positionApple() {
        this.apple.x = Math.floor(Math.random() * (this.scene.game.config.width / this.tileSize)) * this.tileSize;
        this.apple.y = Math.floor(Math.random() * (this.scene.game.config.height / this.tileSize)) * this.tileSize;
    }

    keydown(event) {
        console.log(event);
        switch (event.keyCode) {
            /*We need to be careful that we don't simply reverse the snake onto itself!*/
            case 37: // left key 
                if (this.direction != Phaser.Math.Vector2.RIGHT)
                    this.direction = Phaser.Math.Vector2.LEFT;
                break;
            case 38: // Up key
                if (this.direction != Phaser.Math.Vector2.DOWN)
                    this.direction = Phaser.Math.Vector2.UP;
                break;
            case 39: // Right key
                if (this.direction != Phaser.Math.Vector2.LEFT)
                    this.direction = Phaser.Math.Vector2.RIGHT;
                break;
            case 40: // Down key
                if (this.direction != Phaser.Math.Vector2.UP)
                    this.direction = Phaser.Math.Vector2.DOWN;
                break;
        }
    }

    update(time) {
        if (time >= this.lastMoveTime + this.moveInterval) {
            this.lastMoveTime = time;
            this.move();
        }
    }

    move() {
        let x = this.body[0].x + this.direction.x * this.tileSize;
        let y = this.body[0].y + this.direction.y * this.tileSize;

        // eating the apple: snake head = position of apple
        if (this.apple.x == x && this.apple.y == y) {
            // eaten the apple: now to increase body size
            this.body.push(this.scene.add
                .rectangle(0, 0, this.tileSize, this.tileSize, 0xff00ff)
                .setOrigin(0));
            this.positionApple(); // new apple
            this.moveInterval -= 10;
        }

        // changing directions
        // rest of the body
        for (let idx = this.body.length - 1; idx > 0; idx--) {
            this.body[idx].x = this.body[idx - 1].x;
            this.body[idx].y = this.body[idx - 1].y;
        }
        // head never changes
        this.body[0].x = x;
        this.body[0].y = y;

        // if snake is out of scene: game is reloaded 
        if (this.body[0].x < 0 ||
            this.body[0].x >= this.scene.game.config.width ||
            this.body[0].y < 0 ||
            this.body[0].y >= this.scene.game.config.height
        ) {
            alert("Snake gone into outer space .... Click to continue playing");
            this.scene.scene.restart(); // resets the game
        }

        // if snake crashes into it's tail: it dies 
        // check if the head position = any of its tail position
        let tail = this.body.slice(1); // gets the subarray from a[1] to a[n-1]
        if (tail.some(s => s.x === this.body[0].x &&
                s.y === this.body[0].y)) // check if some part of tail is coincident with head
        {
            alert("You have met your DEATH :P");
            this.scene.scene.restart();
        }
    }
}