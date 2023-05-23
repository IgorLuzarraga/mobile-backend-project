const MovieErrors = {
  FAIL_CREATING_MOVIE: 'Fail creating movie',
  FAIL_UPDATING_MOVIE: 'Fail updating movie',
  FAIL_SEARCHING_MOVIES: 'Fail searchinng movies',
  FAIL_SEARCHING_MOVIE_BY_ID: 'Fail searchinng movie by Id',
  FAIL_SEARCHING_MOVIE_BY_NAME: 'Fail searchinng movie by Name',
  FAIL_DELETING_MOVIE: 'Fail deleting movie',
};

const MovieSuccess = {
  SUCCESS_DELETING_MOVIE: 'Success deleting movie',
};

const MobileDevErrors = {
  FAIL_CREATING_MOBILEDEV: 'Fail creating mobile dev',
  FAIL_UPDATING_MOBILEDEV: 'Fail updating mobile dev',
  FAIL_SEARCHING_MOBILEDEV: 'Fail searchinng mobile dev',
  FAIL_SEARCHING_MOBILEDEV_BY_ID: 'Fail searchinng mobile dev by Id',
  FAIL_SEARCHING_MOBILEDEV_BY_NAME: 'Fail searchinng mobile dev by Name',
  FAIL_DELETING_MOBILEDEV: 'Fail deleting mobile dev',
};

const MobileDevSuccess = {
  SUCCESS_DELETING_MOBILEDEV: 'Success deleting mobile dev',
  SUCCESS_UPDATING_MOBILEDEV: 'Success updating mobile dev',  //Añadida recientemente por J
};

const AppErrors = {
  FAIL_UPDATING_APP: 'Fail updating app',
  FAIL_CREATING_APP: 'Fail creating app',
  FAIL_SEARCHING_APP: 'Fail searchinng app',
  FAIL_SEARCHING_APP_BY_ID: 'Fail searchinng app by Id',
  FAIL_SEARCHING_APP_BY_NAME: 'Fail searchinng app by AppName',
  FAIL_DELETING_APP: 'Fail deleting app',
  FAIL_DELETING_APP_TEST: 'Fail deleting app at test',
};

const AppSuccess = {
  SUCCESS_UPDATING_APP: 'Success updating app',
  SUCCESS_DELETING_APP: 'Success deleting app',
};

const CharacterErrors = {
  FAIL_UPDATING_CHARACTER: 'Fail updating character',
  FAIL_CREATING_CHARACTER: 'Fail creating character',
  FAIL_SEARCHING_CHARACTERS: 'Fail searchinng characters',
  FAIL_SEARCHING_CHARACTER_BY_ID: 'Fail searchinng character by Id',
  FAIL_SEARCHING_CHARACTER_BY_NAME: 'Fail searchinng character by Name',
  FAIL_DELETING_CHARACTER: 'Fail deleting characer',
};

const CharacterSuccess = {
  SUCCESS_UPDATING_CHARACTER: 'Success updating character',
};

module.exports.MovieErrors = MovieErrors;
module.exports.MovieSuccess = MovieSuccess;
module.exports.MobileDevErrors = MobileDevErrors;
module.exports.MobileDevSuccess = MobileDevSuccess;
module.exports.CharacterErrors = CharacterErrors;
module.exports.CharacterSuccess = CharacterSuccess;
module.exports.AppErrors = AppErrors;
module.exports.AppSuccess = AppSuccess;
