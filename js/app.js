var app = angular.module("ToDoApp", ['ngRoute']);

app.config(function($routeProvider) {
        $routeProvider
            .when("/:boardId", {
                templateUrl: 'board.html',
                controller: 'BoardCtrl'
            }).when("/:boardId/:listId", {
                templateUrl: 'list.html',
                controller: 'ListCtrl'
            });
    })
    .controller("myCtrl", function($scope, Data) {

        $scope.mainData = {
            list: Data.getBoards(),
            selectedItem: 0,
            templateBoard: {
                title: 'new board',
                lists: []
            },
            addBoard: function() {
                Data.addBoard(angular.copy($scope.mainData.templateBoard));
            },
            removeBoard: function(_board_ind) {
                Data.removeBoard(_board_ind);
            }

        };


        $scope.selectList = function(_id) {
            $scope.mainData.selectedItem = _id;
        }


    })
    .controller("BoardCtrl", function($routeParams, $scope, Data) {

        var params = $routeParams;

        $scope.boardData = {
            boardId: params.boardId,
            item: Data.getBoardByInd(params.boardId),
            templateList: {
                title: "new list",
                countDone: 0,
                tasks: []
            },
            addList: function() {
                Data.addList(params.boardId, angular.copy($scope.boardData.templateList));
            },
            removeList: function(_list_ind) {
                Data.removeList(params.boardId, _list_ind);
            }
        }

    })
    .controller("ListCtrl", function($routeParams, $scope, Data, $location) {

        var params = $routeParams;

        $scope.listData = {
            list: Data.getListByInd(params.boardId, params.listId),
            templateTask: {
                'title': 'new task',
                'done': false
            },
            addTask: function() {
                Data.addTask(params.boardId, params.listId, angular.copy($scope.listData.templateTask));
            },
            removeTask: function(_task_ind) {
                if ($scope.listData.list.tasks[_task_ind].done == true) {
                    $scope.listData.list.countDone--;
                }
                Data.removeTask(params.boardId, params.listId, _task_ind);
            },
            changeItem: function() {
                var count = 0;
                for (var i = 0; i < $scope.listData.list.tasks.length; i++) {
                    if ($scope.listData.list.tasks[i].done == true) {
                        count++;
                    }
                }
                $scope.listData.list.countDone = count;
            },
            removeList: function() {
                Data.removeList(params.boardId, params.listId);
                $location.path('/' + params.boardId);

            }
        }
    })

.factory('Data', function($localstorage) {

    var data = {
        boards: []
    };

    return {
        getBoards: function() {
            data.boards = $localstorage.getObject('data');
            return data.boards;
        },
        getBoardByInd: function(_board_ind) {
            return data.boards[_board_ind];
        },
        addBoard: function(_board) {
            data.boards.push(_board);
            $localstorage.setObject('data', data.boards);
        },
        removeBoard: function(_board_ind) {
            data.boards.splice(_board_ind, 1);
            $localstorage.setObject('data', data.boards);
        },
        getListsOfBoard: function(_board_ind) {
            return data.boards[_board_ind].lists;
        },
        getListByInd: function(_board_ind, _list_ind) {
            return data.boards[_board_ind].lists[_list_ind];
        },
        addList: function(_board_ind, _list) {
            data.boards[_board_ind].lists.push(_list);
            $localstorage.setObject('data', data.boards);
        },
        removeList: function(_board_ind, _list_ind) {
            data.boards[_board_ind].lists.splice(_list_ind, 1);
            $localstorage.setObject('data', data.boards);
        },
        addTask: function(_board_ind, _list_ind, _task) {
            data.boards[_board_ind].lists[_list_ind].tasks.push(_task);
            $localstorage.setObject('data', data.boards);
        },
        removeTask: function(_board_ind, _list_ind, _task_ind) {
            data.boards[_board_ind].lists[_list_ind].tasks.splice(_task_ind, 1);
            $localstorage.setObject('data', data.boards);
        }
    };
})

.factory('$localstorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}])

.directive('accessManagement', function() {
    return {
        restrict: 'E',
        link: function(scope) {

            scope.dataTemplate = {
                valid: true,
                perms: [{ id: 0, title: 'Read' }, { id: 1, title: 'Write' }, { id: 2, title: 'Admin' }],
                selected_user: null,
                selected_perm: { id: 0, title: 'Read' },
                search_model: "",
                added_users: [],
                all_users: [{
                    name: 'Щукин Валерий Вадимович',
                    perm: 0
                }, {
                    name: 'Константинова Ирина Матвеевна',
                    perm: 1
                }, {
                    name: 'Крылова Анна Святославовна',
                    perm: 2
                }, {
                    name: 'Сысоев Лаврентий Станиславович',
                    perm: 1
                }, {
                    name: 'Филатова Фаина Борисовна',
                    perm: 0
                }, {
                    name: 'Суворов Варлам Германнович',
                    perm: 1
                }, {
                    name: 'Авдеев Руслан Мэлсович',
                    perm: 0
                }]
            }

            scope.addUser = function() {

                scope.dataTemplate.valid = scope.dataTemplate.selected_user != null ? true : false;

                if (scope.dataTemplate.valid) {
                    scope.dataTemplate.selected_user.perm = scope.dataTemplate.selected_perm.id;
                    scope.dataTemplate.added_users.push(scope.dataTemplate.selected_user);
                    scope.dataTemplate.selected_user = null;
                }
            }

            function checkExistUser(_user) {
                return scope.dataTemplate.added_users.indexOf(_user) !== -1;
            }
            scope.removeUser = function(_user) {
                var _ind = scope.dataTemplate.added_users.indexOf(_user);
                scope.dataTemplate.added_users.splice(_ind, 1);
            }
            scope.selectUser = function(_user) {
                scope.dataTemplate.selected_user = _user;
                scope.dataTemplate.search_model = scope.dataTemplate.selected_user.name;
            }
            scope.changeSearch = function () {
                scope.dataTemplate.valid = scope.dataTemplate.search_model.length > 0 ? true : false;
            }
        },
        templateUrl: function() {
            return 'add_user.html';
        }
    }
})

.filter('matcher', function() {
    return function(arr1, arr2) {

        var out_arr = arr1;

        for (var i = 0; i < arr1.length; i++) {
            for (var j = 0; j < arr2.length; j++) {
                if (arr2[j].name == arr1[i].name) {
                    out_arr.splice(i, 1);
                }
            }
        }

        return out_arr;
    }
}f
