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
const vm = new Vue({
  el: '#app',
  data() {
    return{
      conf:{win:3,draw:1,loose:0},
      specials:[
        // {
        // nom:'exemple',
        // ref:[
        //   'A',
        //   'B',
        //   'C'
        // ],
        // equipes:[
        //   {
        //     nom:'team 1',
        //     type:1,
        //     resultat : ['A','B','C']
        //   },
        //   {
        //     nom:'team 2',
        //     type:2,
        //     resultat : ['C','B','A']
        //   },
        //   {
        //     nom:'team 3',
        //     type:1,
        //     resultat : ['D','E','F']
        //   },
        // ],
        // }
      ],
      confirmModal:false,
      selected:null,
      selectedType:null,
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
        if(this.specials.length){
          for (var i = 0; i < this.specials[0].equipes.length; i++) {
            var newLength = equipes.push({nom:this.specials[0].equipes[i].nom,type:this.specials[0].equipes[i].type,resultat : ['']});
          };
        }
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
        this.specials.splice(k, 1);
        localStorage.setItem('data', JSON.stringify(this.specials));
        $('#nav-tab li:nth-child('+k+') a').tab('show');
        this.compare_element();
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
      if($('#add_team_name_option1')[0].checked){
        atype=1;
      } else {
        atype=2;
      }
      if(name){
        $('#add_team_name')[0].value = null;
        for (var i = 0; i < this.specials.length; i++) {
          this.specials[i].equipes.push({nom: name,type:atype,resultat:['']});
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
      if(event.key != 'Backspace'){
        var up = ref_k + 1;
        if($('#sec_'+k+'_ref_'+up)[0]){
          $('#sec_'+k+'_ref_'+up)[0].focus();
        }
      } else {
        var up = ref_k - 1;
        if($('#sec_'+k+'_ref_'+up)[0]){
          $('#sec_'+k+'_ref_'+up)[0].focus();
        }
      }
      this.compare_element();
    },
    add_to_team_ref(k,team_k,ref_k){
      var name = $('#sec_'+k+'_team_'+team_k+'_ref_'+ref_k)[0].value.toUpperCase();
      this.specials[k].equipes[team_k].resultat[ref_k] = name
      localStorage.setItem('data', JSON.stringify(this.specials));
      this.compare_element();
      if(event.key != 'Backspace'){
        var up = ref_k + 1;
        if($('#sec_'+k+'_team_'+team_k+'_ref_'+up)[0]){
          $('#sec_'+k+'_team_'+team_k+'_ref_'+up)[0].focus();
        } else {
          var team_kup = team_k + 1;
          if($('#sec_'+k+'_team_'+team_kup+'_ref_0')[0]){
            $('#sec_'+k+'_team_'+team_kup+'_ref_0')[0].focus();
          }
        }
      } else {
        var up = ref_k - 1;
        if($('#sec_'+k+'_team_'+team_k+'_ref_'+up)[0]){
          $('#sec_'+k+'_team_'+team_k+'_ref_'+up)[0].focus();
        } else {
          var team_kup = team_k - 1;
          var last = $('[id^="sec_'+k+'_team_'+team_kup+'_ref"]').length - 1
          if($('#sec_'+k+'_team_'+team_kup+'_ref_'+last)[0]){
            $('#sec_'+k+'_team_'+team_kup+'_ref_'+last)[0].focus();
          }
        }
      } 
    },
    compare_element(){
      for (var i = 0; i < this.specials.length; i++) {
        var total = 0;
        for (var x = 0; x < this.specials[i].equipes.length; x++) {
          var team = 0;
          for (var y = 0; y < this.specials[i].equipes[x].resultat.length; y++) {
            $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('bg-success');
            $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('bg-warning');
            $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('bg-danger');
            $('#sec_'+i+'_team_'+x+'_ref_'+y).removeClass('text-white');
            if($('#sec_'+i+'_team_'+x+'_ref_'+y).length){
              if($('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value){
              if($('#sec_'+i+'_ref_'+y)[0].value === $('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value){
                team = team + this.conf.win;
                total = team;
                $('#team_'+x+'_sec_'+i+'_pts').val(total);
                $('#total_pts_team_'+x+'_sec_'+i).html(total);
                $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-success text-white');
                } else {
                  if(this.specials[i].ref.indexOf($('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value) >= 0){
                    if($('#sec_'+i+'_ref_'+y)[0].value){
                      team = team + this.conf.draw;
                      total = team;
                      $('#team_'+x+'_sec_'+i+'_pts').val(total);
                      $('#total_pts_team_'+x+'_sec_'+i).html(total);
                      $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-warning');
                    } else {
                      team = team + this.conf.loose;
                      total = team;
                      $('#team_'+x+'_sec_'+i+'_pts').val(total);
                      $('#total_pts_team_'+x+'_sec_'+i).html(total);
                      $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-danger text-white');
                    }
                  }
                  if(this.specials[i].ref.indexOf($('#sec_'+i+'_team_'+x+'_ref_'+y)[0].value) === -1){
                    team = team + this.conf.loose;
                    total = team;
                    $('#team_'+x+'_sec_'+i+'_pts').val(total);
                    $('#total_pts_team_'+x+'_sec_'+i).html(total);
                    $('#sec_'+i+'_team_'+x+'_ref_'+y).addClass('bg-danger text-white');
                  }
                }
              }
            }
          }
        }
      }
    },
    calc_total(){
      start = 0;
      for (var z = 0; z < $("[id^='total_pts_team_']").length; z++){
        var team = $("[id^='total_pts_team_']")[z];
        var teamdata = team.dataset
        if(teamdata.team >= 0){
          nb = Number(team.innerHTML)
          start = start + nb
        } else  {
          start = 0;
        }
        $("#total_pts_team_"+teamdata.team).val(start);
      }
    },
    confirmDelete(t,s) {
      this.selected = s;
      this.selectedType = t;
			this.confirmModal = true;
		},
		cancelDelete() {
			this.confirmModal = false;
      this.selected = null;
      this.selectedType = null;
		},
		deleteUser() {
      this.confirmModal = false;
      if(this.selectedType === 'team'){
        this.remove_team(this.selected)
      } else if (this.selectedType === 'secteur'){
        this. remove_secteur(this.selected)
      }
		},
    changeconf(){
      var array = {
        win:Number($('#add_conf_win')[0].value),
        draw:Number($('#add_conf_draw')[0].value),
        loose:Number($('#add_conf_loose')[0].value)
      };
      this.conf=array;
      localStorage.setItem('conf', JSON.stringify(array));
    },
    backup_conf(type){
      if(type==="resultat"){
        var data = [localStorage.data]
      }
      else if(type==="configuration"){
        var data = [localStorage.conf]
      }
      else {return;}
      var blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
      if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", 'Sauvegarde_'+type+'.R7VA');
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    },
    restor_conf(){
      var selectedFile = document.querySelector('input[type=file]').files[0];
      var content = document.getElementById('msg_content');
      var reader = new FileReader();
      this.specials = null;
      reader.onload = function(event) {
        if(reader.result){
          jsonredear = JSON.parse(reader.result)
          if(jsonredear[0]){
            if(jsonredear[0].nom){
              content.innerHTML = 'Importation des résultats réussi';
              localStorage.setItem('data', reader.result);
              location.reload();
            } 
          } else {
            content.innerHTML = 'Importation de la configuration réussi';
            localStorage.setItem('conf', reader.result);
            location.reload();
          }
        } else {
          content.innerHTML = 'fichier vide';
        }
      };
      if(localStorage.data) this.specials = JSON.parse(localStorage.data);
      if(localStorage.conf) this.conf = JSON.parse(localStorage.conf);
      reader.readAsText(selectedFile);
    },
    default_conf(){
      localStorage.clear();
      location.reload();
    },
  },
})