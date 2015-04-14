game.TitleScreen = me.ScreenObject.extend({
	/**	
	 *  action to perform on state change
	 */
	onResetEvent: function() {	
            //add title screen
            me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage('title-screen')), -10);
            
            
            //*********************************************************
            
            game.data.option1 = new (me.Renderable.extend({
                init: function(){
                    this._super(me.Renderable, 'init', [270, 240, 300, 50]);
                    //font to use for this text
                    this.font = new me.Font("Arial", 45, "White"); 
                    me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                },
                //draw what's on the screen
                draw: function(renderer){
                    //when drawing, passing the context or screen we're drawing in
                    //give the x coordinate of 350, y coordinate of 130
                    this.font.draw(renderer.getContext(), "START A NEW GAME!", this.pos.x, this.pos.y);
              },
              
              update: function(dt){
                  return true;
              },
              
              newGame: function(){                  
                  me.input.releasePointerEvent('pointerdown', this);
                  me.input.releasePointerEvent('pointerdown', game.data.option2);
                  me.state.change(me.state.NEW);
              }
              
            }));
            
            me.game.world.addChild(game.data.option1);
            
            //**********CONTINUE FUNCTION***********************************************
               game.data.option2 =  new (me.Renderable.extend({
                  init: function(){
                    this._super(me.Renderable, 'init', [380, 440, 250, 50]);
                    //font to use for this text
                    this.font = new me.Font("Ariel", 45, "White"); 
                    me.input.registerPointerEvent('pointerdown', this, this.newGame.bind(this), true);
                },
                //draw what's on the screen
                draw: function(renderer){
                    //when drawing, passing the context or screen we're drawing in
                    //give the x coordinate of 350, y coordinate of 130
                    this.font.draw(renderer.getContext(), "CONTINUE!", this.pos.x, this.pos.y);
              },
              
              update: function(dt){
                  return true;
              },
              
              newGame: function(){
                  me.input.releasePointerEvent('pointerdown', game.data.option1);
                  me.input.releasePointerEvent('pointerdown', this);
                  me.state.change(me.state.LOAD);
              }
              
            }));
            
            me.game.world.addChild(game.data.option2);
         
        },	
	
	/**	
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
           
	}
});
