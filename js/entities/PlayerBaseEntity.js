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
		this.health = game.data.playerBaseHealth;
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