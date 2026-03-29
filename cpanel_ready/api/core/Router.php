<?php
// backend/api/core/Router.php

namespace Core;

class Router {
    private array $routes = [];

    public function get($route, $callback) {
        $this->addRoute('GET', $route, $callback);
    }

    public function post($route, $callback) {
        $this->addRoute('POST', $route, $callback);
    }

    public function put($route, $callback) {
        $this->addRoute('PUT', $route, $callback);
    }

    public function delete($route, $callback) {
        $this->addRoute('DELETE', $route, $callback);
    }
    
    public function options($route, $callback) {
        $this->addRoute('OPTIONS', $route, $callback);
    }

    private function addRoute($method, $route, $callback) {
        // Simple regex routing for parameters i.e :id => (?P<id>[a-zA-Z0-9_\-]+)
        $routeRegex = preg_replace('/\:([a-zA-Z0-9_]+)/', '(?P<\1>[a-zA-Z0-9_\-]+)', $route);
        $routeRegex = "#^" . $routeRegex . "$#";
        
        $this->routes[] = [
            'method' => $method,
            'regex' => $routeRegex,
            'callback' => $callback
        ];
    }

    public function dispatch($requestedRoute, $requestMethod) {
        // Automatic preflight CORS handling
        if ($requestMethod === 'OPTIONS') {
            Response::json([], 200);
            return;
        }

        foreach ($this->routes as $route) {
            if ($route['method'] === $requestMethod && preg_match($route['regex'], $requestedRoute, $matches)) {
                // Keep only named captured groups
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                // Execute closure callback
                if (is_callable($route['callback'])) {
                    call_user_func_array($route['callback'], [$params]);
                    return;
                } 
                // Execute controller array callback e.g. [Controller::class, 'method']
                elseif (is_array($route['callback']) && count($route['callback']) == 2) {
                    $controllerName = $route['callback'][0];
                    $methodName = $route['callback'][1];
                    
                    if (class_exists($controllerName)) {
                        $controller = new $controllerName();
                        if (method_exists($controller, $methodName)) {
                            call_user_func_array([$controller, $methodName], [$params]);
                            return;
                        } else {
                            Response::error("Method bulunamadı.", 500);
                        }
                    } else {
                        Response::error("Controller bulunamadı.", 500);
                    }
                }
            }
        }

        Response::error("Endpoint bulunamadı. ($requestMethod $requestedRoute)", 404);
    }
}
