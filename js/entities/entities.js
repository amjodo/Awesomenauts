game.PlayerEntity = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y,  {
			image: "player",
			width: 64,
			height: 64,
			spritewidth: "64",
			spriteheight: "64",
			getShape: function(){
				return(new me.Rect(0, 0, 64, 64)).toPolygon();
			}
		}]);
		this.type = "PlayerEntity";
		//sets velocity
		this.health = game.data.playerHealth;
		this.body.setVelocity(game.data.playerMoveSpeed, 20);
		//keeps track of where your character is going
		this.facing ="right"; 
		this.now = new Date().getTime();
		this.lastHit = this.now;
		this.dead = false;
		this.attack = game.data.playerAttack;
		this.lastAttack = new Date(). getTime(); //haven't used this
		//no matter where my player goes, we are going to follow him
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
			//error with current animation
		this.renderable.addAnimation("idle", [78]);
			//adding annimation and setting speed
		this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);
		this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);

		this.renderable.setCurrentAnimation("idle");
	},

	update: function(delta){
		this.now = new Date().getTime();

		if(this.health <= 0){
			this.dead = true;
		}

		if(me.input.isKeyPressed("right")) {
			//sets position of x using multiplication
			//set velocity
			//me.timer.tick makes movement look smooth
			this.body.vel.x += this.body.accel.x * me.timer.tick;
			//flips animation so it now faces right and go right
			this.facing = "right";
			this.flipX(true);
		}//going left 
		else if(me.input.isKeyPressed("left")){
			this.facing = "left";
			this.body.vel.x -= this.body.accel.x * me.timer.tick;
			this.flipX(false);
		}else{
			//when right arrow isnt clicked
			this.body.vel.x = 0;
		}
		//y axis not apart of code above, not jumping and falling
		if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
			this.body.jumping = true;
			this.body.vel.y -= this.body.accel.y * me.timer.tick;
			me.audio.play("jump");
		}
		
		if(me.input.isKeyPressed("attack")){
			if(!this.renderable.isCurrentAnimation("attack")){
				//sets the current animation to attack and once that is over
				//goes back to the idle animation
				this.renderable.setCurrentAnimation("attack", "idle");
				//makes it so that the next time we start this sequence we begin
				//from the first animation, not wherever we left off when we
				//switched to another animation
				this.renderable.setAnimationFrame();
			}
		}

		else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
			//adding walk animation so it oesnt run forever
			if(!this.renderable.isCurrentAnimation("walk")){
				this.renderable.setCurrentAnimation("walk");
			}
		}else if(!this.renderable.isCurrentAnimation("attack")){
			this.renderable.setCurrentAnimation("idle");
		}

		me.collision.check(this,true, this.collideHandler.bind(this), true);
		this.body.update(delta);





		this._super(me.Entity, "update", [delta]);
		return true;
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},
	
	collideHandler:function(response){
			if(response.b.type==='EnemyBaseEntity'){
				var ydif = this.pos.y - response.b.pos.y;
				var xdif = this.pos.x -response.b.pos.x;

				if(ydif<-40 && xdif< 70 && xdif>-35){
					this.body.falling = false;
					this.body.vel.y = -1;
				}
				else if(xdif>-35 && this.facing==='right' && (xdif<0)){
					this.body.vel.x = 0;
					//this.pos.x = this.pos.x -1;
				}else if(xdif<70 && this.facing==='left' && xdif>0){
					this.body.vel.x = 0;
					//this.pos.x = this.pos.x +1;
				}

				if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttackTimer){
					
					this.lastHit = this.now;
					response.b.loseHealth(game.data.playerAttack);
				};
			}else if(response.b.type==='EnemyCreep'){
				//not just walking through
				var xdif = this.pos.x - response.b.pos.x;
				var ydif = this.pos.y - response.b.pos.y;

				if (xdif>0){
					//this.pos.x = this.pos.x + 1;
					if(this.facing==="left"){
						this.body.vel.x = 0;
					}
				}else{
					//this.pos.x = this.pos.x - 1;
					if(this.facing==="right"){
						this.body.vel.x = 0;
				}
			}
				if (this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= game.data.playerAttack
					  && (Math.abs(ydif) <=40) && //keeps track of space between
					  (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))) {
					
					this.lastHit = this.now; 
					//if the creeps health is less than our attack,execute code in if statement
					if(response.b.loseHealth <= game.data.playerAttack){
						//adds one gold for a creep kill
						game.data.gold += 1;
						console.log("Current gold: " + game.data.gold);	
					}

					response.b.loseHealth(game.data.playerAttack);
				}
			}
	    }
	});
//setting image heights and widths