Vue.config.productionTip = false;
Vue.config.devtools = false;
Vue.component("confirmation-modal", {
	template: "#del_modal",
	props: ["open"],
	methods: {
		onConfirm() {
			this.$emit("confirm");
		},
		onCancel() {
			this.$emit("cancel");
		}
	}
});
const app = new Vue({
  el: '#app',
  data() {
    return{
      conf:{win:3,draw:1,loose:0},
      specials:[{
        nom:'exemple',
        ref:[
          'A',
          'B',
          'C'
        ],
        equipes:[
          {
            nom:'team 1', 
            resultat : ['A','B','C']
          },
          {
            nom:'team 2', 
            resultat : ['C','B','A']
          },
          {
            nom:'team 3', 
            resultat : ['D','E','F']
          },
        ],
      }],
      confirmModal:false,
      selectedTeam:null,
    }
  },
  mounted() {
    if(localStorage.data) this.specials = JSON.parse(localStorage.data);
    if(localStorage.conf) this.conf = JSON.parse(localStorage.conf);
  },
  updated(){
    this.compare_element();
    $('input[id^="sec_"]').keyup(function(){
      this.value = this.value.toUpperCase();
    });
  },
  methods: {
    add_secteur(){
      var name = $('#add_secteur_name')[0].value;
      if(name){
        $('#add_secteur_name')[0].value = null;
        var equipes = [];
        for (var i = 0; i < this.specials[0].equipes.length; i++) {
          var newLength = equipes.push({nom:this.specials[0].equipes[i].nom, resultat : ['']});
        };
        var push_array = {
          nom:name,
          ref:[""],
          equipes
        };
        this.specials.push(
          push_array
        );
        $('#secteur_Modal').modal('hide')
        localStorage.setItem('data', JSON.stringify(this.specials));
        this.compare_element();
      }
    },
    remove_secteur(k){
      if(k != 0){
        this.specials.splice(k, 1);
        localStorage.setItem('data', JSON.stringify(this.specials));
        $('#nav-tab li:nth-child('+k+') a').tab('show');
        this.compare_element();
      }
    },
    add_ref(k){
      this.specials[k].ref.push('');
      Vue.set(this.specials[k].ref, "val3", "c");
      localStorage.setItem('data', JSON.stringify(this.specials));
      this.compare_element();
    },
    remove_ref(k){
      var last = this.specials[k].ref.length - 1;
      this.specials[k].ref.splice(last, 1);
      for (var i = 0; i < this.specials[k].equipes.length; i++) {
        this.specials[k].equipes[i].resultat.splice(last, 1);
      }
      localStorage.setItem('data', JSON.stringify(this.specials));
      this.compare_element();
    },
    add_team(k){
      var name = $('#add_team_name')[0].value;
      if(name){
        $('#add_team_name')[0].value = null;
        for (var i = 0; i < this.specials.length; i++) {
          this.specials[i].equipes.push({nom: name,resultat:['']});
        }
        localStorage.setItem('data', JSON.stringify(this.specials));
      }
      $('#team_Modal').modal('hide');
      this.compare_element();
    },
    remove_team(team_k){
      for (var i = 0; i < this.specials.length; i++) {
        this.specials[i].equipes.splice(team_k, 1);
      }
      localStorage.setItem('data', JSON.stringify(this.specials));
      this.compare_element();
    },
    add_to_ref(k,ref_k){
      var name = $('#sec_'+k+'_ref_'+ref_k)[0].value.toUpperCase();
      this.specials[k].ref[ref_k] = name
      localStorage.setItem('data', JSON.stringify(this.specials));
      var up = ref_k + 1;
      if($('#sec_'+k+'_ref_'+up)[0]){
        $('#sec_'+k+'_ref_'+up)[0].focus();
      }
      this.compare_element();
    },
    add_to_team_ref(k,team_k,ref_k){
      var name = $('#sec_'+k+'_team_'+team_k+'_ref_'+ref_k)[0].value.toUpperCase();
      this.specials[k].equipes[team_k].resultat[ref_k] = name
      // console.log(name);
      localStorage.setItem('data', JSON.stringify(this.specials));
      var up = ref_k + 1;
      if($('#sec_'+k+'_team_'+team_k+'_ref_'+up)[0]){
        $('#sec_'+k+'_team_'+team_k+'_ref_'+up)[0].focus();
      }
      this.compare_element();
    },
    compare_element(){
      for (var i = 0; i < this.specials.length; i++) {
        var total = 0;
        for (var x = 0; x < this.specials[i].equipes.length; x++) {
          var team = 0;
          for (var y = 0; y < this.specials[i].equipes[x].resultat.length; y++) {
            if($('#sec_'+i+'_team_'+x+'_ref_'+y).length){
              if($('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value){
              $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('bg-success')
              $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('bg-warning')
              $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('bg-danger')
              $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('text-white')
              if($('#sec_'+i+'_ref_'+y)[0].value === $('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value){
                team = team + this.conf.win
                total = team
                $('#team_'+x+'_sec_'+i+'_pts').html(total)
                $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-success text-white')
                } else {
                  if(this.specials[i].ref.indexOf($('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value) >= 0){
                    if($('#sec_'+i+'_ref_'+y)[0].value){
                      team = team + this.conf.draw
                      total = team
                      $('#team_'+x+'_sec_'+i+'_pts').html(total)
                      $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-warning')
                    } else {
                      team = team + this.conf.loose
                      total = team
                      $('#team_'+x+'_sec_'+i+'_pts').html(total)
                      $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-danger text-white')
                    }
                  }
                  if(this.specials[i].ref.indexOf($('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value) === -1){
                    team = team + this.conf.loose
                    total = team
                    $('#team_'+x+'_sec_'+i+'_pts').html(total)
                    $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-danger text-white')
                  }
                }
              }
            }
          }
        }
      }
    },
    confirmDelete(u) {
			this.selectedTeam = u;
			this.confirmModal = true;
		},
		cancelDelete() {
			this.confirmModal = false;
			this.selectedTeam = null;
		},
		deleteUser() {
			this.confirmModal = false;
      console.log(this.selectedTeam)
      this.remove_team(this.selectedTeam)
		},
    changeconf(){
      console.log($('#add_conf_win')[0].value)
      console.log($('#add_conf_draw')[0].value)
      console.log($('#add_conf_loose')[0].value)
      var array = {
        win:Number($('#add_conf_win')[0].value),
        draw:Number($('#add_conf_draw')[0].value),
        loose:Number($('#add_conf_loose')[0].value)
      };
      this.conf=array;
      localStorage.setItem('conf', JSON.stringify(array));
    },
  },
})








//OLD // Check browser support
// if (typeof(Storage) !== "undefined") {


//     ChargelocalStorage()

//     // compare les éléments
//     $(".team").change(function() {

//         var keyid = $(this).attr("id");
//         var savedid = localStorage.getItem(keyid);
//         // console.log("Last Key "+savedid);
//         // console.log("id "+$(this).attr("id"));
//         // console.log("ref id "+$(this).attr("data-refid"));
//         // console.log("value "+$(this)[0].value);
//         // console.log("ref value "+$("#"+$(this).attr("data-refid"))[0].value);
//             // var team_value = $(this)[0].value;
//             // var team_id    = $(this).attr("id");
//             // var ref_id     = $(this).attr("data-refid");
//             // var ref_value  = $("#"+ref_id)[0].value;
//             // CheckValue(team_value, team_id, ref_value);

//         // CheckValue(
//         //     $(this)[0].value,
//         //     $("#"+$(this).attr("data-refid"))[0].value,
//         //     $(this).attr("id"),
//         //     $(this).attr("data-refid")
//         // );
// // console.log('test')
// // ChargelocalStorage()
//     });


//     function jsonlocalstorage(id, value) {
//         this.id = id;
//         this.value = value;
//     }

//     function addmyjsontolocal(id, value){
//         var Objs = new jsonlocalstorage(id, value);
//         Obj.push(Objs);
//         localStorage.setItem(key, JSON.stringify(Obj));
//     }

//     function add(json, id, value) {

//         var foundid = json.some(function (el) {
//           return el.id === id;
//         });
//         var foundvalue = json.some(function (el) {
//             console.log(el)
//           return el.id === id && el.value === value;
//         });
//         console.log("id "+foundid)
//         console.log("value "+foundvalue)
//         if (!foundid) {
//             json.push({ id: id, value: value });
//             localStorage.setItem(key, JSON.stringify(json));
//         }
//         if(foundid && !foundvalue) {
//             json.value = value;

//             console.log(json);
//         }
//     }
//     // Enregistre les inputs
//     $( "input" ).change(function() {

//         // i = $(this).attr("id").substring(0, 4);
//         // console.log(localStorage.getItem(i) )
//         // if(localStorage.getItem(i) == null){
//         //     var element = {}, Objs = [];
//         //     element.ref = $(this).attr("id");
//         //     element.value = $(this)[0].value;
//         // } else {
//         //     Objs = JSON.parse(localStorage.getItem(i))
//         //     var element = {}
//         // }
//         // element.ref = $(this).attr("id");
//         // element.value = $(this)[0].value;
//         // Objs.push({element: element});
//         // console.log(Objs)
//         // localStorage.setItem(i, JSON.stringify(Objs));

//         key = $(this).attr("id").substring(0, 4);
//         if(localStorage.getItem(key) == null){
//             Obj = [];
//             var Objs = new addmyjsontolocal($(this).attr("id"), $(this)[0].value);
//         } else {
//             Obj = JSON.parse(localStorage.getItem(key))
//             add(Obj,$(this).attr("id"), $(this)[0].value);
//         }

//         for (var p in Obj) {
//             // console.log(Obj[p].id);
//             // console.log(Obj[p].value);
//             if(Obj[p].id != $(this).attr("id")){

//                 // console.log(Obj);
//             }
//         }
//         // console.log(Obj)









//         // console.log('Save Key: ' + $(this).attr("id") + ', Value: ' + $(this)[0].value);
//     //localStorage.setItem($(this).attr("id"), $(this)[0].value);
//         // if($("#"+$(this).attr("id")).hasClass('ref')){
//     //        ChargelocalStorage()
//         // }
//     //if($("#"+$(this).attr("id")).hasClass('ref')){
//             ChargelocalStorage()
//     //    }
//     });




// function CheckValue(team_value, team_id, ref_value){
//     if(team_value === ref_value){
//         $("#"+team_id).addClass("alert-success").removeClass("alert-danger")
//         // console.log("value good"+team_value)
//         var vvl = Number($("#team_1_sec1_pts")[0].value);
//         $("#team_1_sec1_pts").val(vvl+2);
//         return true
//     } else {
//         $("#"+team_id).addClass("alert-danger").removeClass("alert-success")
//         // console.log("value not good"+team_value)
//         var vvl = Number($("#team_1_sec1_pts")[0].value);
//         $("#team_1_sec1_pts").val(vvl-2);
//         return false;
//     }
// }


// function ChargelocalStorage(){
//     // Charge les données des inputs
//     $("#team_1_sec1_pts").val(0);
//     for (var i = 0; i < localStorage.length; i++) {
//         var key = localStorage.key(i);
//         var value = localStorage.getItem(key);
//         // console.log('Key: ' + key + ', Value: ' + value);
//         $("#"+key).val(value);
//         if($("#"+key).hasClass('ref')){

//         }
//         if($("#"+key).hasClass('team')){
//             var team_value = value;
//             var team_id    = key
//             var ref_id     = $("#"+key).attr("data-refid");
//             var ref_value  = $("#"+ref_id)[0].value;
//             CheckValue(team_value, team_id, ref_value);
//         }
//     }
// };
// } else {
// }