game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings){
        this.setSuper(x, y);
        this.setPlayerTimers();
        this.setAttributes();        

        this.type = "PlayerEntity"; 

        this.setFlags();   
    
    //no matter the player screen is going to follow him
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    this.addAnimation();
    
    //set currentAnimation to idle
    this.renderable.setCurrentAnimation("idle");

    },

    //************setSuper()****************************************************************
    //***Init Refactor functions************************************************************

    setSuper: function(x, y){
        this._super(me.Entity, 'init', [x, y, {
              image: "player",
              width: 64,
              height: 64,
              spritewidth: "64",
              spriteheight: "64",           
              getShape: function(){
                  return(new me.Rect(0, 0, 64, 64)).toPolygon();
              }        
      }]);

    },

    setPlayerTimers: function(){
        this.now = new Date().getTime();
        this.lastHit = this.now;
        this.lastSpear = this.now;
        this.lastAttack = new Date().getTime(); //haven't use the attack variable yet 
    },

    setAttributes: function(){
        this.health = game.data.playerHealth;    
        // move 5 units to the right
        //represent our current position
        // need to add collision so player won't fall
        this.body.setVelocity(game.data.playerMoveSpeed, 20); // 20 make y location has change 
    },
    
    setFlags: function(){
        //keep track of which direction the character is going
        this.facing = "right";
        //keep track of what time it is for the date   
        this.dead = false;
        this.attacking = false;       
    },

    addAnimation: function(){
        this.renderable.addAnimation("idle", [78]);    
        //walk animation on the spritesheet, 8o milisecond between frame
        this.renderable.addAnimation("walk", [117, 118, 119, 120, 121, 122, 123, 124, 125], 80);    
        //Animation for character attack
        this.renderable.addAnimation("attack", [65, 66, 67, 68, 69, 70, 71, 72], 80);
    },


    //******************************************************************************************
    // Update function
    //******************************************************************************************
    update: function(delta){
        this.now = new Date().getTime();

        this.dead = this.checkIfDead();

        this.checkKeyPressesAndMove();
 //***************checkAbilityKeys**************************************************
 
        this.checkAbilityKeys();
        
        this.setAnimation();
        
        
        // passing parameters to the collideHandler
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        
        //call the update function
        this.body.update(delta);
        this._super(me.Entity, "update", [delta]);
        return true;
    },

    //********Update Refactor functions*********************************************************
    //******************************************************************************************

    checkIfDead: function(){
            if(this.health <= 0){
            return true;                 
           }
           return false;
        },

    checkKeyPressesAndMove: function(){
             //press the right button, set to walk
        if(me.input.isKeyPressed("right")){
             this.moveRight();      
        }
        
        //move player to the left
        else if(me.input.isKeyPressed("left")){
              this.moveLeft();
           
        }      
        else
        {
            this.body.vel.x = 0;
        }
        
        //make a new if statement focusing on jumping
          if(me.input.isKeyPressed("jump") && !this.body.jumping && !this.body.falling){
              this.jump();
          }

          this.attacking = me.input.isKeyPressed("attack");
                
        },

        //**********end of checkKeyPressesAndMove*****************************

    moveRight: function(){
             //move from the current position
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);// switch from facing the left to right
        },

    moveLeft: function(){
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.facing = "left";
            this.flipX(false);
            me.audio.play("enemykill");
        }, 

    jump: function(){
            this.body.jumping = true;// Melon has jumping variable
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            me.audio.play("jump", false);
        },
        
  //*******************checkAbilityKeys**************************************
  
    checkAbilityKeys: function(){
        if(me.input.isKeyPressed("skill1")){
            //this.speedBurst();
        }
        else if(me.input.isKeyPressed("skill2")){
            //this.eatCreep();
        }
        else if(me.input.isKeyPressed("skill3")){
            this.throwSpear();
        }
    },
    
    throwSpear: function(){
      //if(this.now - this.lastSpear >= game.data.spearTimer * 1000 && game.data.ability3 > 0){
      if((this.now-this.lastSpear) >= game.data.spearTimer*1000 && game.data.ability3 > 0){
            this.lastSpear = this.now;
            var spear = me.pool.pull("spear", this.pos.x, this.pos.y, {}, this.facing);
            me.game.world.addChild(spear, 10);
        }
    },
    
    //************************************************************************
    setAnimation: function(){
             //Make your character Attack by pressing a
        if(this.attacking){
             if(!this.renderable.isCurrentAnimation("attack")){
                //set current animation to attack and then set it to idle
                this.renderable.setCurrentAnimation("attack", "idle");
                me.audio.play("stomp");
                //next time we start this sequence begin with first animation
                this.renderable.setAnimationFrame();
                               
            }
        }
                        
        else if(this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")){
            if(!this.renderable.isCurrentAnimation("walk")){
                this.renderable.setCurrentAnimation("walk");
            }
        }
        else if(!this.renderable.isCurrentAnimation("attack"))
        {
            this.renderable.setCurrentAnimation("idle");
        }
    },

    
    //**************loseHealth function******************************************************
    //**************************************************************************************
    loseHealth: function(damage){
        this.health = this.health - damage;
      
    },
    
    collideHandler: function(response){
        if(response.b.type === 'EnemyBaseEntity'){
                this.collideWithEnemyBase(response);  
            }
            else if(response.b.type === 'EnemyCreep') {
                this.collideWithEnemyCreep(response);
	        }
         },

 //*********Refactor collide function**********************************************************
 //********************************************************************************************

    collideWithEnemyBase: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            //player fall on top of the tower
            if(ydif < -40 && xdif < 70 && xdif > -35){
                this.body.falling = false;
                this.body.vel.y = -1;
            }            
            //make player moves right
            else if(xdif > -30 && this.facing === 'right'&& (xdif < 0)){
                this.body.vel.x = 0;
            }
            // coming from the right side and prevent from overlapping
            else if(xdif < 70 && this.facing === 'left' && xdif > 0){
                this.body.vel.x = 0;              
            }
            
            //if we're attacking by making contact with the base, lose health
            if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer){
                this.lastHit = this.now;
                //pass how much damage the base going to take
                response.b.loseHealth(game.data.playerAttack);
               }
          },

    collideWithEnemyCreep: function(response){

         var xdif = this.pos.x - response.b.pos.x; // x difference
         var ydif = this.pos.y - response.b.pos.y; // y difference

         this.stopMovement(xdif);
        
         if(this.checkAttack(xdif, ydif)){
               this.hitCreep(response);
            }                        
      
        },

    stopMovement: function(xdif){
               if (xdif > 0) {
            
            if (this.facing === "left") {
            this.body.vel.x = 0;
               }
             }
            else
             {
            
            if (this.facing === "right") {
               this.body.vel.x = 0;
              }
            }
          },

    checkAttack: function(xdif, ydif){
        if(this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
            && (Math.abs(ydif) <= 40) && (((xdif > 0) && this.facing === "left") 
            || ((xdif < 0) && this.facing === "right"))){
         
            //update our timer
            this.lastHit = this.now;

            return true;
               
            }
        return false

        },

        hitCreep: function(response){
            //if the creep health is less than our Attack, execute code in the if the statement
             if(response.b.health <= game.data.playerAttack){ 
                    //add one gold for a creep kill
                     game.data.gold += 1;
                     console.log("gold: " + game.data.gold
                             );
                 }
                        
            response.b.loseHealth(game.data.playerAttack);
        }

     });
