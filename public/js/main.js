const sideBar = document.getElementById("sideBar");
      const btn = document.getElementById('btn');
      
      if (!localStorage.getItem("isSmall")){
        localStorage.setItem("isSmall", "no");
      }

      if (localStorage.getItem("isSmall") === "yes"){
        sideBar.classList.add('small-sideBar');
      } else {
        sideBar.classList.remove('small-sideBar');
      }
      
      
      btn.addEventListener('click', () => {
        if (localStorage.getItem("isSmall") === "no") {
          sideBar.classList.add('small-sideBar');
          localStorage.setItem("isSmall", "yes");
        } else {
          sideBar.classList.remove('small-sideBar');
          localStorage.setItem("isSmall", "no");
        }   
      })