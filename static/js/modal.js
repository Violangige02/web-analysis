const addModal = (id)=>{
	let el = `
		<div id=${id} class="modal fade" role="dialog">
		  <div class="modal-dialog">

			<!-- Modal content-->
			<div class="modal-content">
			  <div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" style="position:absolute;right:2%;">&times;</button>
				<h4 class="modal-title">Modal Header</h4>
			  </div>
			  <div class="modal-body" >
				<p>Some text in the modal.</p>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal" >Close</button>
			  </div>
			</div>

		  </div>
		</div>
	`
	return el
}

$(document).ready(function(){
	document.body.innerHTML += addModal("appModal")
})

function appModal(){
	
	let html = `
    <div class="row" style="display:flex;text-align:center;align-items:center;width:100%;display:grid;plae-items:center;">
    <i class="fa-solid fa-circle-plus fa-2x"></i><br><div class="headline">Create App</div></div>
    <br>
    <form novalidate="novalidate" class="v-form CustomFormModifier px-5 pt-3" method="POST"><div class="v-input v-input--has-state v-input--dense theme--light v-text-field v-text-field--is-booted v-text-field--enclosed v-text-field--outlined error--text"><div class="v-input__control">
        <div class="v-input__slot"><div class="v-input__prepend-inner">
            <div class="v-input__icon v-input__icon--prepend-inner">
                <i aria-hidden="true" class="v-icon notranslate mdi mdi-account-circle theme--light error--text"></i>
            </div>
        </div>
        <fieldset aria-hidden="true"><legend style="width: 0px;"><span class="notranslate">&ZeroWidthSpace;</span></legend></fieldset>
        <div class="v-text-field__slot"><label for="input-371" class="v-label theme--light error--text" style="left: 0px; right: auto;">App Name *</label>
        <input name="AppName" pllaceholder="App Name" autofocus="autofocus" type="text" required></div>
        </div><div class="v-text-field__details"><div class="v-messages theme--light error--text" role="alert"><div class="v-messages__wrapper"><div class="v-messages__message">Required.</div></div></div></div></div></div>
        <div class="v-input v-input--hide-details theme--light v-input--selection-controls v-input--checkbox"><div class="v-input__control">

            
        </div></div></div><button type="submit" class="mt-4 v-btn v-btn--block v-btn--has-bg theme--light v-size--small" style="height: 35px; width: 100px;"><span class="v-btn__content">CREATE APP</span></button></form>

	`
	const body =document.getElementById("appModal");
	const title = body.getElementsByClassName("modal-title")
	const el = body.getElementsByClassName("modal-body")
	title[0].innerHTML = "Create App"
	el[0].innerHTML = html
	el[0].setAttribute("style","max-height:456px;overflow:auto;")
	body.setAttribute("style","min-width:456px;")
}