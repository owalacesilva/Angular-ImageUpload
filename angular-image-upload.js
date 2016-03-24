/**
*  Module
*
* Description
*/
angular.module('ui.image-upload', [])
  .config(Configuration)
  .provider('imgUpload', ImgUploadProvider)
  .directive('imgUpload', ImgUploadDirective);

Configuration.$inject = ['imgUploadProvider'];
function Configuration(imgUploadProvider) {
  /**
   * Define as configurações internal do provider
   * nesse caso é setada a url de requisição do serviço
   */
  imgUploadProvider.setUrlServer('');
}

function ImgUploadProvider() {
  var _urlServer = null;

  function _send(formData) {
    var xhr = new XMLHttpRequest();

    xhr.upload.onprogress = function(event) {
      if(event.lengthComputable) {
        percentCompleted = Math.round(event.loaded / event.total * 100);
        console.log(percentCompleted);
      }
    }

    xhr.onload = function(event) {
      console.log('finish');
    }

    // Inicializa uma request
    xhr.open('POST', _urlServer, true);

    // Envia a requisição iniciada anteriormente
    xhr.send(formData);
  }

  this.setUrlServer = function(urlString) {
    _urlServer = urlString;
  }

  this.$get = function() {
    return {
      send: _send
    };
  }
}

function ImgUploadDirective() {
  return {
    restrict: 'A',
    controller: ImgUploadDirectiveCtrl,
    link: function(scope, elem, attr, ctrl) {
      var elImage = angular.element('<img src="" alt="">');
      var elInput = angular.element('<input type="file" name="file"></input>');

      elem.append(elImage);
      elem.append(elInput);

      function elInputChange(event) {
        var target = event.target || event.currentTarget;
        var fileList = target.files;
        var resource = null;

        if(fileList.length > 0) {
          resource = fileList[0];
        }

        decodeFile(resource);
      }

      function decodeFile(file) {
        var fileReader = new FileReader();
        fileReader.onload = function(event) {
          var target    = event.target || event.currentTarget;
          var result    = target.result;

          elImage.attr('src', result);

          // Cria uma formulario key/value para envido de dados
          var formData  = new FormData();
          formData.append('file', file);

          ctrl.sendRequest(formData);
        }

        fileReader.readAsDataURL(file);
      }

      function imgLoaded(event) {
      }

      elInput.bind('change', elInputChange);
      elImage.bind('load', imgLoaded);
    }
  }
}

ImgUploadDirectiveCtrl.$inject = ['imgUpload']
function ImgUploadDirectiveCtrl(imgUpload) {
  this.sendRequest = function(formData) {
    imgUpload.send(formData);
  }
}