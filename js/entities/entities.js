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
		this.health = 20;
		this.body.setVelocity(5, 20);
		//keeps track of where your character is going
		this.facing ="right"; 
		this.now = new Date().getTime();
		this.lastHit = this.now;
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
				console.log(!this.renderable.isCurrentAnimation("attack"));
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
		console.log(this.health);
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
					this.pos.x = this.pos.x -1;
				}else if(xdif<70 && this.facing==='left' && xdif>0){
					this.body.vel.x = 0;
					this.pos.x = this.pos.x +1;
				}

				if(this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000){
					console.log("tower Hit");
					this.lastHit = this.now;
					response.b.loseHealth();
				}
			}else if(response.b.type==='EnemyCreep'){
				var xdif = this.pos.x - response.b.pos.x;
				var ydif = this.pos.y - response.b.pos.y;

				if (xdif>0){
					this.pos.x = this.pos.x + 1;
					if(this.facing==="left"){
						this.vel.x = 0;
					}
				}else{
					this.pos.x = this.pos.x - 1;
					if(this.facing==="right"){
						this.vel.x = 0;
				}
				if (this.renderable.isCurrentAnimation("attack") && this.now-this.lastHit >= 1000
					  && (Math.abs(ydif) <=40) &&
					  (((xdif>0) && this.facing==="left") || ((xdif<0) && this.facing==="right"))) {
					this.lastHit = this.now; 
					response.b.loseHealth(1);
				}
			}
	    }
});
//setting image heights and widths
game.PlayerBaseEntity = me.Entity.extend({
	init : function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				//so it can be a polygon to use
				return (new me.Rect(0, 0, 100, 70)). toPolygon();
			}
		}]);
		//updating even if you aren't looking at it
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "PlayerBaseEntity";
		//not burning animation
		this.renderable.addAnimation("idle", [0]);
		//burning animation
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta){
		if(this.health<=0){
			this.broken = true;
			//setting it to be broken
			this.renderable.setCurrentAnimation("broken");
		}
		//continues to update
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function(){

	}
});

game.EnemyBaseEntity = me.Entity.extend({
	init : function(x, y, settings){
		this._super(me.Entity, 'init', [x, y, {
			image: "tower",
			width: 100,
			height: 100,
			spritewidth: "100",
			spriteheight: "100",
			getShape: function(){
				return (new me.Rect(0, 0, 100, 70)). toPolygon();
			}
		}]);
		this.broken = false;
		this.health = 10;
		this.alwaysUpdate = true;
		this.body.onCollision = this.onCollision.bind(this);
		this.type = "EnemyBaseEntity";
		//not burning animation
		this.renderable.addAnimation("idle", [0]);
		//burning animation
		this.renderable.addAnimation("broken", [1]);
		this.renderable.setCurrentAnimation("idle");
	},

	update:function(delta){
		if(this.health<=0){
			this.broken = true;
			this.renderable.setCurrentAnimation("broken");
		}
		this.body.update(delta);

		this._super(me.Entity, "update", [delta]);
		return true;
	},

	onCollision: function(){
		
	},

	loseHealth: function(){
		this.health = 10;
	}
});

game.EnemyCreep = me.Entity.extend({
	init: function(x, y, settings){
		this._super(me.Entity, 'init', [x, y,{
			image: "creep1",
			width:32,
			height:64,
			spritewidth: "32",
			spriteheight: "64",
			getShape: function(){
				return (new me.Rect(0, 0, 32, 64)).toPolygon();
			}
		}]);
		this.health = 10;
		this.alwaysUpdate = true;

		this.attacking = false;

		this.lastAttacking = new Date().getTime();

		this.lastHit = new Date().getTime();
		this.body.setVelocity(3, 20);

		this.type = "EnemyCreep";

		this.renderable.addAnimation("walk", [3, 4, 5], 80);
		this.renderable.setCurrentAnimation("walk");
	},

	loseHealth: function(damage){
		this.health = this.health - damage;
	},

	//creeps will drop to the ground and move the way they're supposed to
	update: function(delta){
		console.log(this.health);
		//represents time parameter
		if(this.health <= 0) {
			me.game.world.removeChild(this);
		}

		this.now = new Date().getTime();

		this.body.vel.x -= this.body.accel.x * me.timer.tick;
		//making it so it actually moves
		//basic update calls 
		this.body.update(delta);



		this._super(me.Entity, "update", [delta]);

		return true;

	},

	collideHandler: function(response){
		if(response.b.type==='PlayerBase'){
			this.attacking=true;
			this.body.vel.x = 0;
			//keeps moving the creep tothe right to maintain its position
			this.pos.x = this.pos.x + 1;
			//checks that it has been at least 1 second since this creep
			if((this.now-this.lastHit >= 1000)){
				//updates the lastHit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function
				//damage of 1
				response.b.loseHealth(1);
			}
		}else if (response.b.type ==='PlayerEntity'){
			var xdif = this.pos.x - response.b.pos.x;

			this.attacking=true;
			//this.lastAttacking=this.now

			if(xdif>0){
				//keeps moving the creep tothe right to maintain its position
				this.pos.x = this.pos.x + 1;
				this.body.vel.x = 0;
			}	
			//checks that it has been at least 1 second since this creep
			if((this.now-this.lastHit >= 1000) && xdif>0){
				//updates the lastHit timer
				this.lastHit = this.now;
				//makes the player base call its loseHealth function
				//damage of 1
				response.b.loseHealth(1);
			}
		}
	}
});

game.GameManager = Object.extend({
	init: function(x, y, settings){
		this.now = new Date().getTime();
		this.lastCreep = new Date().getTime();

		this.alwaysUpdate = true;
	},

	update: function(){
		this.now = new Date().getTime();

		if(Math.round(this.now/1000)%10 ===0 && (this.now - this.lastCreep >=1000)){
			this.lastCreep = this.now;
			var creepe = me.pool.pull("EnemyCreep", 1000, 0, {});
			me.game.world.addChild(creepe, 5);
		}

		return true;
	}
});