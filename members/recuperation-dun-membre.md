# Récupération

{% api-method method="get" host="https://localhost:8080/api" path="/v1/member/:id" %}
{% api-method-summary %}
Get Récupération d'un membre
{% endapi-method-summary %}

{% api-method-description %}
Récupération d'un membre
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="id" type="string" %}
L'ID du membre à récupérer
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Cake successfully retrieved.
{% endapi-method-response-example-description %}

```javascript
{
    "status": "success",
    "result": [
        {
            "id": 1,
            "name": "John"
        },
        ]
}
    
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=404 %}
{% api-method-response-example-description %}
Could not find a cake matching this query.
{% endapi-method-response-example-description %}

```javascript
{
    "status": "error",
    "message": "wrong id"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}



