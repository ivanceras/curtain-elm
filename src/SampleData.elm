module SampleData exposing (..)

json_desc = """
        {
            "variant": "String",
            "fields": [
              "Second hand Iphone4s"
            ]
          }

"""

json_active = """
        {
            "variant": "Bool",
            "fields": [
              true
            ]
          }
"""

name_json_field = """{
        "name": "name",
        "column": "name",
        "complete_name": "bazaar.product.name",
        "is_keyfield": false,
        "data_type": "String",
        "reference": "character varying",
        "reference_value": null,
        "description": "This is @Required it has @DisplayLength(50) - 50 character in display length a @MinLength(1) and @MaxLength(100) - Do not go over 100 characters or else the system will throw a ValueTooLong exception\\ncan also be express with @Length(1-100)",
        "info": null,
        "is_significant": true,
        "significance_priority": 10,
        "include_in_search": false,
        "is_mandatory": false,
        "seq_no": 0,
        "is_same_line": false,
        "is_displayed": true,
        "is_readonly": false,
        "is_autocomplete": false,
        "display_logic": null,
        "display_length": null,
        "default_value": null
      }
"""

