## How helpers work

  ```ruby
  namespace :admin do
    resources :issues, only: %I[index show update destroy] do
      get :appointees, on: :member
    end
  end
  ```


```
appointess_admin_issue_path
```

if nesting resoruces
```
edit_admin_issue_product

accounts_url         #-> /accounts
account_url(1)       #-> /accounts/1
people_url(1)        #-> /accounts/1/people
person_url(1,2)      #-> /accounts/1/people/2
notes_url(1,2)       #-> /accounts/1/people/2/notes
note_url(1,2,3)      #-> /accounts/1/people/2/notes/3
comments_url(1,2,3)  #-> /accounts/1/people/2/notes/3/comments
comment_url(1,2,3,4) #-> /accounts/1/people/2/notes/3/comments/4
```

## Members

```ruby
# /photos/1/preview with GET

# preview_photo_url
resources :photos do
  member do
    get 'preview'
  end
end

resources :photos do
  get 'preview', :on => :member
end
```



```ruby

# /photos/search
#  search_photos_url 
  resources :photos do
  collection do
    get 'search'
  end
end

```


## Bound parameters

```ruby
  match ':controller(/:action(/:id))'


  match ':controller/:action/:id/with_user/:user_id'
  # /photos/show/1/with_user/2
  # { :controller => “photos”, :action => “show”, :id => “1”, :user_id => “2” }
```

If an incoming request of /photos/show/1 is processed by this route (because it hasn’t matched any previous route in the file), then the result will be to invoke the show action of the PhotosController, and to make the final parameter "1" available as params[:id]. This route will also route the incoming request of /photos to PhotosController#index, since :action and :id are optional parameters, denoted by parentheses.

## Scopes

  If you want to route /posts (without the prefix /admin) to Admin::PostsController, you could use

  ```ruby
  scope :module => "admin" do
    resources :posts, :comments
  end
  ```

  If you want to route /admin/posts to PostsController (without the Admin:: module prefix), you could use
  ```ruby
    scope "/admin" do
      resources :posts, :comments
    end
  ```

## Nesting

```ruby

Rails.application.routes.draw do
  resources :posts do
    resources :comments, only: [:create, :destroy]
  end

  resources :comments, only: :index
end

```

## Aliases

When we add the "as" clause to this route, if you run bundle exec rake routes, you'll see the Prefix column with register, and you can use register_path to get /register the path. Now, if we want to change the path to /login, all we have to do is just to:

```ruby
  get '/login', to: 'users#new', as: 'register'

```

Now our register_path gives us /login. We don't have to change our code in the Rails app at all.


## Root


```ruby
  root to: 'posts#index'
```

## Match

```ruby
  # `match` & `via:` allow us to define one route and use several HTTP verbs
  # `as:` lets us define the name of the route prefix

  match '/authors/:id' => 'authors#update',
    via: [:put, :patch],
    as:   :update_author
  # update_author  PUT|PATCH /authors/:id(.:format)  authors#update
```

## Segment constraints

```ruby
  match 'photos/:id' => 'photos#show', :constraints => { :id => /[A-Z]\d{5}/ }

```

## Request-Based Constraints

```ruby
  match "photos", :constraints => {:subdomain => "admin"}

  namespace :admin do
  constraints :subdomain => "admin" do
    resources :photos
  end
end

```

##  Specifying a Controller to Use

```ruby
  resources :photos, :controller => "images"

```

## Passing more params

```ruby

   resources :posts do
# define extra params to pass for requests to a route
    get 'popular', on: :collection, action: :index, popular: true
# popular_posts  GET /posts/popular(.:format)  posts#index {:popular=>true}

    get 'preview', on: :member

    # ...
  end


```

## Redirect with routes

```ruby

# we can even use routes to redirect
  get '/home', to: redirect('/')


```


## Collection

collection route: See how above we nest our /popular route under the posts resource. We then use on: :collection to specify what part of a resource we are nesting this route under. We have many posts so that is considered a collection. By specifying on: :collection we are saying, "Match a URL with path /posts/popular." If we didn't add on: :collection, Rails will assume that this route corresponds to another resource associated with a single member of our posts collection. In that case our route would become /posts/:id/popular. We can also specify multiple collection routes by using a block format.

multiople collections

```ruby
  collection do
  get 'popular'
end
```

## See routes of any controller

```ruby
  CONTROLLER=users rake routes
```

## Giude about nesting routes

Simple! However, in using RESTful routes more and more, I’m coming to realize that this is not a best practice. Rule of thumb: resources should never be nested more than 1 level deep. A collection may need to be scoped by its parent, but a specific member can always be accessed directly by an id, and shouldn’t need scoping (unless the id is not unique, for some reason).