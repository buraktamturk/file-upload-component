(function(root, factory) {
  if(typeof define === 'function' && define.amd) {
    define(['file-dialog', 'prettysize'], factory);
  } else if(typeof exports === 'object') {
    module.exports = factory(require('file-dialog'), require('prettysize'));
  } else {
    root.FileUploadComponent = factory(root.fileDialog, root.prettysize);
  }
})(this, function(fileDialog, prettysize) {
  return {
    register: function(name, MakeUploadController) {
      class FilePickerElement extends HTMLElement {
        constructor() {
          super();

          this.area = document.createElement('div');
          this.area.className = 'main-area';

          this.listenerFnc = this.listener.bind(this);
        }

        connectedCallback() {
          this.appendChild(this.area);

          if(!this.$controller) {
            this.$controller = MakeUploadController.new({
              $value: (this.hasAttribute('value') && this.getAttribute('value').length && this.getAttribute('value')) || null,
              $src: (this.hasAttribute('src') && this.getAttribute('src').length && this.getAttribute('src')) || null,
              $name: (this.hasAttribute('filename') && this.getAttribute('filename').length && this.getAttribute('filename')) || null,
              $size: (this.hasAttribute('size') && this.getAttribute('size').length && this.getAttribute('size')) || null
            });
          }

          this.$controller.addListener(this.listenerFnc);
        }

        setController(controller) {
          if(this.$controller && this.isConnected) {
            this.$controller.removeListener(this.listenerFnc);
          }

          this.$controller = controller;

          if(this.$controller && this.isConnected) {
            this.$controller.addListener(this.listenerFnc);
          }
        }

        listener() {
          if(this.$controller.$state == 1) {
            if(this.hiddenInput) {
              this.hiddenInput.parentNode.removeChild(this.hiddenInput);
              this.hiddenInput = null;
            }

            if(this.middleArea) {
              this.area.removeChild(this.middleArea);
              this.middleArea = null;
            }

            if(this.finalArea) {
              this.area.removeChild(this.finalArea);
              this.finalArea = null;
            }

            if(!this.uploadBtn) {
              this.uploadBtn = document.createElement('a');
              this.uploadBtn.href = "#";
              this.uploadBtn.className = "btn btn-sm btn-primary";
              var that = this;

              this.uploadBtn.onclick = function(e) {
                e.preventDefault();

                fileDialog({
                  accept: that.hasAttribute('accepts') ? that.getAttribute('accepts') : 'image/*'
                }).then(function(files) {
                  var file = files[0];
                  if(file) {
                    that.$controller.upload(file.name, file.type, file);
                  }
                }); 
              };
              
              var icon = document.createElement('i');
              icon.className = "fa fa-upload";

              this.uploadBtn.appendChild(icon);
              if(this.hasAttribute("desc")) {
                this.uploadBtn.appendChild(document.createTextNode(" "));
                this.descNode = document.createTextNode(this.getAttribute("desc"));

                this.uploadBtn.appendChild(this.descNode);
              }

              this.area.appendChild(this.uploadBtn);
            } else if(this.descNode) {
              this.descNode.textContent = this.getAttribute("desc");
            }
          } else if(this.$controller.$state == 2) {
            if(this.hiddenInput) {
              this._shadowRoot.removeChild(this.hiddenInput);
              this.hiddenInput = null;
            }

            if(this.uploadBtn) {
              this.area.removeChild(this.uploadBtn);
              this.uploadBtn = null;
              this.descNode = null;
            }

            if(this.finalArea) {
              this.area.removeChild(this.finalArea);
              this.finalArea = null;
            }

            if(!this.middleArea) {
              this.middleArea = document.createElement('div');
              this.middleArea.className = "small";

              var cancelBtn = document.createElement('a');
              cancelBtn.className = "btn btn-sm btn-outline-danger";
              cancelBtn.href = '#';

              var that = this;
              cancelBtn.onclick = function(e) {
                e.preventDefault();
                that.$controller.cancel();
              };
              
              var icon = document.createElement('i');
              icon.className = "fa fa-times-circle";
              
              cancelBtn.appendChild(icon);
              this.middleArea.appendChild(cancelBtn);
              this.middleArea.appendChild(document.createTextNode(" "));

              cancelBtn = document.createElement('a');
              cancelBtn.className = "btn btn-sm btn-outline-dark disabled";
              cancelBtn.href = '#';
              this.middleArea.appendChild(cancelBtn);

              var icon = document.createElement('i');
              icon.className = "fa fa-spinner fa-spin";
              
              cancelBtn.appendChild(icon);

              cancelBtn.appendChild(document.createTextNode(" "));

              var span = document.createElement('span');
              span.style.width = '35px';
              span.style.display = 'inline-block';  

              this.statusNode = document.createTextNode(Math.round(this.$controller.$pr * 100) + '%');
              span.appendChild(this.statusNode);
              cancelBtn.appendChild(span);


              cancelBtn.appendChild(document.createTextNode(" "));

              this.fileNameNode = document.createTextNode(this.$controller.name);
              cancelBtn.appendChild(this.fileNameNode);

              this.area.appendChild(this.middleArea);
            } else if(this.statusNode) {
              this.statusNode.textContent = Math.round(this.$controller.$pr * 100) + '%';
            }
          } else if(this.$controller.$state == 3) {
            if(this.uploadBtn) {
              this.area.removeChild(this.uploadBtn);
              this.uploadBtn = null;
              this.descNode = null;
            }

            if(this.middleArea) {
              this.area.removeChild(this.middleArea);
              this.middleArea = null;
            }

            if(!this.finalArea) {
              this.finalArea = document.createElement('div');
              this.finalArea.className = "small";

              var cancelBtn = document.createElement('a');
              cancelBtn.href = "#";
              cancelBtn.className = "btn btn-sm btn-outline-danger";
              var that = this;
              cancelBtn.onclick = function(e) {
                e.preventDefault();
                that.$controller.remove();
              };
              
              var icon = document.createElement('i');
              icon.className = "fa fa-trash";

              cancelBtn.appendChild(icon);
              this.finalArea.appendChild(cancelBtn);

              this.finalArea.appendChild(document.createTextNode(" "));

              this.fileNameA = document.createElement('a');
              this.fileNameA.className = 'btn btn-sm btn-outline-primary';
              this.fileNameA.href = this.$controller.$src;
              this.fileNameA.target = "_blank";

              icon = document.createElement('i');
              icon.className = "fa fa-download";

              this.fileNameA.appendChild(icon);

              this.fileNameA.appendChild(document.createTextNode(" "));

              this.fileNameNode = document.createTextNode(this.$controller.$name);
              this.fileNameA.appendChild(this.fileNameNode);
              this.finalArea.appendChild(this.fileNameA);

              if(this.$controller.$size) {
                this.finalArea.appendChild(document.createTextNode(" ("));

                this.statusNode = document.createTextNode(prettysize(this.$controller.$size));

                this.finalArea.appendChild(this.statusNode);
                this.finalArea.appendChild(document.createTextNode(")"));
              }

              this.area.appendChild(this.finalArea);
            } else {
              if(this.fileNameNode) {
                this.fileNameNode.innerText = this.$controller.$name;
                this.fileNameNode.src = this.$controller.$src;
              }

              if(this.statusNode) {
                this.statusNode.textContent = prettysize(this.$controller.$size);
              }
            }

            if(this.hasAttribute('name')) {
              if(!this.hiddenInput) {
                this.hiddenInput = document.createElement('input');
                this.hiddenInput.type = 'hidden';
                this.hiddenInput.name = this.getAttribute('name');
                this.parentNode.appendChild(this.hiddenInput);
              }

              this.hiddenInput.value = this.$controller.$value;
            }
          }
        }

        disconnectedCallback() {
          this.removeChild(this.area);

          this.$controller.removeListener(this.listenerFnc);

          if(this.hiddenInput) {
            this.hiddenInput.parentNode.removeChild(this.hiddenInput);
            this.hiddenInput = null;
          }
        }

        static get observedAttributes() {
          return ['value', 'src', 'name', 'filename', 'size', 'desc'];
        }
    
        attributeChangedCallback(name, oldValue, newValue) {
          if(this.isConnected) {
            switch(name) {
              case "value":
              case "src":
              case "size":
              case "filename":
        //        this.updateData();
              break;
              case "name":
                if(this.hiddenInput) {
                  this.hiddenInput.name = newValue;
                }
              break;
              case "desc":
                if(this.uploadBtn) {
                  if(this.descNode) {
                    this.descNode.textContent = newValue;
                  } else if(this.hasAttribute("desc")) {
                    this.uploadBtn.appendChild(document.createTextNode(" "));
                    this.descNode = document.createTextNode(this.getAttribute("desc"));
    
                    this.uploadBtn.appendChild(this.descNode);
                  }
                }
              break;
            }
          }
        }
      }

      window.customElements.define(name, FilePickerElement);

      return FilePickerElement;
    }
  };
});