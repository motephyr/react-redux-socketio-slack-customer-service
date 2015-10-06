import Rx from 'rx-lite';
import keyMirror from "react/lib/keyMirror";

var maxTaskID = 0;

export const status = keyMirror({
    PROGRESS: null,
    COMPLETE: null,
    FAILED: null,
})

exports.uploadFile = function(file){
    maxTaskID = maxTaskID + 1;

    return Rx.Observable.create(observer => {
        var formdata = new FormData();
        formdata.append("image", file);
      
        const task = {
          id: maxTaskID,
          progress: 0,
          fileName: file.name,
          entity: {},
          status: status.PROGRESS,
        };

        observer.onNext(Object.assign({}, task))
      
        $.ajax({
          url: "/api/images/upload",
          type: "POST",
          data: formdata,
          processData: false,
          contentType: false,
          headers: {
            'Authorization': 'Bearer ' + Session.getAccessToken()
          },
          xhr() {
              var myXhr = $.ajaxSettings.xhr();
              if(myXhr.upload){
                myXhr.upload.addEventListener('progress', progress => {
                  observer.onNext(Object.assign({}, task, {
                    progress: progress.loaded / progress.total
                  }));                
                }, false);
              }
              return myXhr;
          },
          success(imageEntity) {
            observer.onNext(Object.assign({}, task, {
              progress: 1,
              entity: imageEntity,
              status: status.COMPLETE,
            }));
            observer.onCompleted();
          },
          error(error) {
            observer.onNext(Object.assign({}, task, {
              progress: 1,
              status: status.FAILED,
            }));
            observer.onError(error);
          },
      });
    })
}
