Template.hello.greeting = ->
	"Welcome to meteor."

Template.hello.events "click input": ->
	console.log "You pressed the button"
